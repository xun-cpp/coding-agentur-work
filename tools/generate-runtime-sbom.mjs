import { randomUUID } from 'node:crypto';

const release = process.argv[2] ?? 'unknown';
const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);
const input = Buffer.concat(chunks).toString('utf8');

const components = input.split(/\r?\n/).filter(Boolean).map((line) => {
  const [name, version, architecture, ...unexpected] = line.split('|');
  if (!name || !version || !architecture || unexpected.length) throw new Error(`Invalid runtime inventory line: ${line}`);
  const operatingSystem = name === 'debian' || name === 'linux-kernel';
  const debianPackage = !operatingSystem && name !== 'node';
  const namespace = debianPackage ? 'debian' : 'coding-agentur-runtime';
  return {
    type: operatingSystem ? 'operating-system' : 'library',
    'bom-ref': `runtime:${name}@${version}`,
    group: namespace,
    name,
    version,
    purl: `pkg:generic/${encodeURIComponent(name)}@${encodeURIComponent(version)}?arch=${encodeURIComponent(architecture)}`,
    properties: [{ name: 'architecture', value: architecture }]
  };
});

if (!components.some((component) => component.name === 'node') || !components.some((component) => component.name === 'nginx')) {
  throw new Error('Runtime inventory is missing required components.');
}

const sbom = {
  bomFormat: 'CycloneDX',
  specVersion: '1.6',
  serialNumber: `urn:uuid:${randomUUID()}`,
  version: 1,
  metadata: {
    timestamp: new Date().toISOString(),
    component: {
      type: 'application',
      'bom-ref': `coding-agentur-production:${release}`,
      name: 'coding-agentur-production-runtime',
      version: release
    }
  },
  components
};

process.stdout.write(`${JSON.stringify(sbom, null, 2)}\n`);
