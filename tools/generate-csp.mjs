import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = join(repositoryRoot, 'www');
const outputFile = join(repositoryRoot, 'deploy', 'nginx', 'generated', 'csp.conf');
const maximumHeaderBytes = 12 * 1024;
const noncePlaceholder = '__CSP_NONCE__';

async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(path) : [path];
  }));
  return files.flat();
}

function addNoncePlaceholders(html) {
  return html
    .replace(/<script\b(?![^>]*\bnonce=)/gi, `<script nonce="${noncePlaceholder}"`)
    .replace(/<style\b(?![^>]*\bnonce=)/gi, `<style nonce="${noncePlaceholder}"`);
}

function validateMarkup(html, file) {
  for (const tag of html.matchAll(/<[^>]+>/g)) {
    if (/\son[a-z]+\s*=/i.test(tag[0])) throw new Error(`Inline event handler in ${file}`);
    if (/\b(?:href|src|action)\s*=\s*["']\s*javascript:/i.test(tag[0])) throw new Error(`javascript: URL in ${file}`);
  }
  for (const match of html.matchAll(/<script\b([^>]*)\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi)) {
    const source = match[2] ?? '';
    if (!source.startsWith('/') && !source.startsWith('https://challenges.cloudflare.com/')) {
      throw new Error(`Unexpected script origin ${source} in ${file}`);
    }
  }
}

const files = await filesBelow(publicRoot);
const sourceMaps = files.filter((file) => extname(file).toLowerCase() === '.map');
if (sourceMaps.length) throw new Error(`Production source maps are forbidden: ${sourceMaps.join(', ')}`);

const htmlFiles = files.filter((file) => extname(file).toLowerCase() === '.html');
if (!htmlFiles.length) throw new Error('No generated HTML files found. Build the frontend first.');

let scriptTags = 0;
let styleTags = 0;
for (const file of htmlFiles) {
  const html = addNoncePlaceholders(await readFile(file, 'utf8'));
  validateMarkup(html, file);
  scriptTags += html.match(/<script\b/gi)?.length ?? 0;
  styleTags += html.match(/<style\b/gi)?.length ?? 0;
  const missingNonce = html.match(/<(?:script|style)\b(?![^>]*\bnonce=)[^>]*>/gi);
  if (missingNonce?.length) throw new Error(`Nonce placeholder missing in ${file}`);
  await writeFile(file, html, 'utf8');
}

const directives = [
  "default-src 'none'",
  "script-src 'nonce-$request_id' 'strict-dynamic' 'self' https://challenges.cloudflare.com",
  "script-src-attr 'none'",
  "style-src 'self'",
  "style-src-elem 'self' 'nonce-$request_id'",
  "style-src-attr 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://challenges.cloudflare.com",
  'frame-src https://challenges.cloudflare.com',
  "worker-src 'self'",
  "manifest-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests'
];
const policy = directives.join('; ');
if (Buffer.byteLength(policy, 'utf8') > maximumHeaderBytes) {
  throw new Error(`Generated CSP exceeds ${maximumHeaderBytes} bytes.`);
}

await mkdir(dirname(outputFile), { recursive: true });
await writeFile(outputFile, `add_header Content-Security-Policy "${policy}" always;\n`, 'utf8');
console.info(`CSP generated: ${scriptTags} script tags and ${styleTags} style tags nonce-bound, ${Buffer.byteLength(policy, 'utf8')} bytes.`);
