import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const lockfiles = [resolve(root, 'backend/package-lock.json'), resolve(root, 'frontend/package-lock.json')];
const batchSize = 500;
const maximumResponseBytes = 8 * 1024 * 1024;

function packageName(packagePath) {
  const marker = 'node_modules/';
  const offset = packagePath.lastIndexOf(marker);
  return offset === -1 ? undefined : packagePath.slice(offset + marker.length);
}

async function lockedPackages() {
  const packages = new Map();
  for (const lockfile of lockfiles) {
    const lock = JSON.parse(await readFile(lockfile, 'utf8'));
    for (const [packagePath, metadata] of Object.entries(lock.packages ?? {})) {
      const name = packageName(packagePath);
      const version = metadata?.version;
      if (!name || name.includes('/node_modules/') || typeof version !== 'string') continue;
      packages.set(`${name}@${version}`, { name, version });
    }
  }
  return [...packages.entries()].sort(([left], [right]) => left.localeCompare(right));
}

async function queryBatch(entries) {
  const response = await fetch('https://api.osv.dev/v1/querybatch', {
    method: 'POST',
    redirect: 'error',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      queries: entries.map(([, dependency]) => ({
        package: { ecosystem: 'npm', name: dependency.name },
        version: dependency.version
      }))
    }),
    signal: AbortSignal.timeout(30_000)
  });
  if (!response.ok) throw new Error(`OSV returned HTTP ${response.status}.`);
  const declaredSize = Number(response.headers.get('content-length') ?? 0);
  if (declaredSize > maximumResponseBytes) throw new Error('OSV response exceeded the configured size limit.');
  const body = await response.text();
  if (Buffer.byteLength(body, 'utf8') > maximumResponseBytes) throw new Error('OSV response exceeded the configured size limit.');
  const parsed = JSON.parse(body);
  if (!Array.isArray(parsed.results) || parsed.results.length !== entries.length) throw new Error('OSV returned an invalid batch response.');
  return parsed.results;
}

try {
  const dependencies = await lockedPackages();
  const findings = [];
  for (let offset = 0; offset < dependencies.length; offset += batchSize) {
    const batch = dependencies.slice(offset, offset + batchSize);
    const results = await queryBatch(batch);
    results.forEach((result, index) => {
      for (const vulnerability of result.vulns ?? []) {
        if (typeof vulnerability?.id === 'string') findings.push(`${batch[index][0]}: ${vulnerability.id}`);
      }
    });
  }
  if (findings.length) {
    console.error(`OSV scan found ${findings.length} vulnerability match(es):`);
    findings.sort().forEach((finding) => console.error(`- ${finding}`));
    process.exitCode = 1;
  } else {
    console.log(`OSV scan passed (${dependencies.length} locked npm package versions checked).`);
  }
} catch (error) {
  console.error(`OSV scan could not complete: ${error instanceof Error ? error.message : 'unknown failure'}`);
  process.exitCode = 2;
}
