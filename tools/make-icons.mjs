import sharp from 'sharp';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const out = process.argv[2];
await mkdir(out, { recursive: true });

const brandTop = '#5079f2';
const brandBottom = '#2f56cf';

const mark = ({ size = 1024, pad = 0, stroke = 77, radius = 232, bg = true }) => {
  const inner = 1024 - pad * 2;
  const s = inner / 1024;
  const t = (x) => (x * s + pad).toFixed(2);
  const w = (stroke * s).toFixed(2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1024 1024">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${brandTop}"/><stop offset="1" stop-color="${brandBottom}"/>
  </linearGradient></defs>
  ${bg ? `<rect x="${pad}" y="${pad}" width="${inner}" height="${inner}" rx="${(radius * s).toFixed(2)}" fill="url(#g)"/>` : ''}
  <g fill="none" stroke="#ffffff" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">
    <path d="M${t(416)} ${t(352)} L${t(288)} ${t(512)} L${t(416)} ${t(672)}"/>
    <path d="M${t(608)} ${t(352)} L${t(736)} ${t(512)} L${t(608)} ${t(672)}"/>
  </g>
  <path d="M${t(552)} ${t(286)} L${t(452)} ${t(738)}" fill="none" stroke="#cfdcff" stroke-width="${w}" stroke-linecap="round"/>
</svg>`;
};

const faviconSvg = mark({ stroke: 92, radius: 216 });
const maskableSvg = mark({ pad: 96, stroke: 92, radius: 232 });

await writeFile(path.join(out, 'favicon.svg'), faviconSvg);

const png = (svg, size) => sharp(Buffer.from(svg)).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

const sizes = { 'icon-192.png': 192, 'icon-512.png': 512, 'apple-touch-icon.png': 180, 'logo.png': 512 };
for (const [name, size] of Object.entries(sizes)) {
  await writeFile(path.join(out, name), await png(faviconSvg, size));
}
await writeFile(path.join(out, 'icon-maskable-512.png'), await png(maskableSvg, 512));

const icoSizes = [16, 32, 48];
const blobs = [];
for (const size of icoSizes) blobs.push(await png(faviconSvg, size));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(blobs.length, 4);
let offset = 6 + blobs.length * 16;
const entries = blobs.map((blob, index) => {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(icoSizes[index] === 256 ? 0 : icoSizes[index], 0);
  entry.writeUInt8(icoSizes[index] === 256 ? 0 : icoSizes[index], 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(blob.length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += blob.length;
  return entry;
});
await writeFile(path.join(out, 'favicon.ico'), Buffer.concat([header, ...entries, ...blobs]));

console.log('icons written to', out);
