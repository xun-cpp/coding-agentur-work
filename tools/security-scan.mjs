import { readFile, readdir, stat } from 'node:fs/promises';
import { basename, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const excludedDirectories = new Set(['.git', '.astro', 'coverage', 'dist', 'node_modules', 'www']);
const textExtensions = new Set(['.astro', '.conf', '.css', '.html', '.js', '.json', '.md', '.mjs', '.ps1', '.sh', '.sql', '.toml', '.ts', '.tsx', '.txt', '.yaml', '.yml']);
const forbiddenCredentialNames = /(?:deploy_credentials|backup codes?|recovery codes?|id_rsa|id_ed25519|deploy_id[^.]*)(?:\.|$)/i;
const strongSecretPatterns = [
  /-----BEGIN (?:OPENSSH|RSA|EC|DSA) PRIVATE KEY-----/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bgh[opsu]_[A-Za-z0-9]{30,}\b/,
  /\b(?:postgres(?:ql)?):\/\/[^\s:/]+:[^\s@]+@/i
];
const assignmentSecretPatterns = [
  /\b(?:api[_-]?key|client[_-]?secret|session[_-]?secret|private[_-]?key|password)\s*[:=]\s*["'][^"']{12,}["']/i
];
const unsafeCodePatterns = [
  { expression: /\beval\s*\(/, label: 'eval()' },
  { expression: /\bnew\s+Function\s*\(/, label: 'dynamic Function()' },
  { expression: /dangerouslySetInnerHTML/, label: 'dangerouslySetInnerHTML' },
  { expression: /\.innerHTML\s*=/, label: 'innerHTML assignment' },
  { expression: /\bchild_process\b|from\s+["']node:child_process["']/, label: 'child_process' }
];
const findings = [];
const reviewedUnsafeConstructs = new Map([
  ['tools/make-og.mjs', new Set(['child_process'])]
]);

async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.flatMap((entry) => {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) return [];
    const path = join(directory, entry.name);
    return entry.isDirectory() ? [filesBelow(path)] : [[path]];
  }));
  return nested.flat(2);
}

const files = await filesBelow(root);
for (const file of files) {
  const path = relative(root, file).replaceAll('\\', '/');
  if (forbiddenCredentialNames.test(basename(file))) findings.push(`${path}: credential/recovery artifact in repository`);
  const info = await stat(file);
  if (info.size > 2 * 1024 * 1024 || !textExtensions.has(extname(file).toLowerCase())) continue;
  const source = await readFile(file, 'utf8');
  const fixture = path.includes('/tests/') || path.endsWith('.env.example');
  if (strongSecretPatterns.some((pattern) => pattern.test(source)) || (!fixture && assignmentSecretPatterns.some((pattern) => pattern.test(source)))) {
    findings.push(`${path}: possible embedded secret`);
  }
  if (/\.(?:ts|tsx|js|mjs|astro)$/.test(file) && path !== 'tools/security-scan.mjs') {
    for (const unsafe of unsafeCodePatterns) {
      if (unsafe.expression.test(source) && !reviewedUnsafeConstructs.get(path)?.has(unsafe.label)) findings.push(`${path}: unsafe construct ${unsafe.label}`);
    }
  }
}

for (const packageFile of ['backend/package.json', 'frontend/package.json']) {
  const manifest = JSON.parse(await readFile(join(root, packageFile), 'utf8'));
  for (const group of ['dependencies', 'devDependencies']) {
    for (const [name, version] of Object.entries(manifest[group] ?? {})) {
      if (/^[~^*]|latest|next/i.test(String(version))) findings.push(`${packageFile}: unpinned ${group} entry ${name}`);
    }
  }
  const lockFile = join(root, packageFile.replace('package.json', 'package-lock.json'));
  try { await stat(lockFile); } catch { findings.push(`${packageFile}: package-lock.json missing`); }
}

const generatedCsp = await readFile(join(root, 'deploy/nginx/generated/csp.conf'), 'utf8').catch(() => '');
if (!generatedCsp) findings.push('deploy/nginx/generated/csp.conf: generated CSP missing');
if (/script-src[^;]*'unsafe-(?:inline|eval)'/.test(generatedCsp)) findings.push('deploy/nginx/generated/csp.conf: unsafe script CSP directive');

const publicFiles = await filesBelow(join(root, 'www')).catch(() => []);
for (const file of publicFiles) {
  const extension = extname(file).toLowerCase();
  if (['.bak', '.conf', '.env', '.key', '.lock', '.log', '.map', '.pem', '.sql'].includes(extension)) {
    findings.push(`${relative(root, file).replaceAll('\\', '/')}: forbidden public artifact`);
  }
  if (extension === '.html') {
    const path = relative(root, file).replaceAll('\\', '/');
    const source = await readFile(file, 'utf8');
    for (const tag of source.match(/<script\b[^>]*>/gi) ?? []) {
      if (!/\bnonce="__CSP_NONCE__"/.test(tag)) findings.push(`${path}: script tag without CSP nonce placeholder`);
      if (/\son[a-z]+\s*=/i.test(tag) || /javascript:/i.test(tag)) findings.push(`${path}: unsafe executable HTML attribute`);
    }
    for (const tag of source.match(/<style\b[^>]*>/gi) ?? []) {
      if (!/\bnonce="__CSP_NONCE__"/.test(tag)) findings.push(`${path}: style tag without CSP nonce placeholder`);
    }
    for (const tag of source.match(/<[a-z][^>]*>/gi) ?? []) {
      if (/\son[a-z]+\s*=/i.test(tag) || /(?:href|src)\s*=\s*["']\s*javascript:/i.test(tag)) findings.push(`${path}: inline event handler or javascript URL`);
    }
  }
}

const requiredCspDirectives = [
  "default-src 'none'", "script-src 'nonce-$request_id' 'strict-dynamic'", "script-src-attr 'none'",
  "object-src 'none'", "base-uri 'none'", "form-action 'self'", "frame-ancestors 'none'"
];
for (const directive of requiredCspDirectives) {
  if (!generatedCsp.includes(directive)) findings.push(`deploy/nginx/generated/csp.conf: required directive missing: ${directive}`);
}
if (Buffer.byteLength(generatedCsp, 'utf8') > 4096) findings.push('deploy/nginx/generated/csp.conf: CSP include exceeds the 4 KiB operational limit');

const nginxConfig = await readFile(join(root, 'deploy/nginx/nginx.conf'), 'utf8').catch(() => '');
const nginxSite = await readFile(join(root, 'deploy/nginx/reference-application.conf'), 'utf8').catch(() => '');
if (!/\bserver_tokens\s+off;/.test(nginxConfig)) findings.push('deploy/nginx/nginx.conf: server_tokens off missing');
if (!nginxSite.includes("sub_filter '__CSP_NONCE__' $request_id;")) findings.push('deploy/nginx/reference-application.conf: CSP nonce substitution missing');
if (!/\bssl_protocols\s+TLSv1\.2\s+TLSv1\.3;/.test(nginxSite)) findings.push('deploy/nginx/reference-application.conf: restricted TLS protocol set missing');
if (!/add_header\s+Cache-Control\s+"[^"]*\bno-transform\b[^"]*"\s+always;/.test(nginxSite)) {
  findings.push('deploy/nginx/reference-application.conf: HTML no-transform cache control missing');
}

const realIpConfig = await readFile(join(root, 'deploy/nginx/conf.d/10-cloudflare-realip.conf'), 'utf8').catch(() => '');
const firewallConfig = await readFile(join(root, 'deploy/firewall/nftables.conf'), 'utf8').catch(() => '');
const cidrs = (source) => new Set(source.match(/(?:\d{1,3}(?:\.\d{1,3}){3}|[0-9a-f:]+)\/\d{1,3}/gi) ?? []);
const realIpCidrs = cidrs(realIpConfig);
const firewallCidrs = cidrs(firewallConfig);
if (realIpCidrs.size < 20 || [...realIpCidrs].some((cidr) => !firewallCidrs.has(cidr))) {
  findings.push('Cloudflare trust ranges differ between NGINX and nftables');
}

for (const file of files.filter((candidate) => relative(root, candidate).replaceAll('\\', '/').startsWith('.github/workflows/'))) {
  const path = relative(root, file).replaceAll('\\', '/');
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(/^\s*uses:\s*[^\s#]+@([^\s#]+)/gm)) {
    if (!/^[0-9a-f]{40}$/.test(match[1])) findings.push(`${path}: GitHub Action is not pinned to a full commit SHA`);
  }
}

if (findings.length) {
  console.error(`Security scan failed with ${findings.length} finding(s):`);
  findings.sort().forEach((finding) => console.error(`- ${finding}`));
  process.exitCode = 1;
} else {
  console.info(`Security scan passed (${files.length} repository files inspected; dependency trees excluded).`);
}
