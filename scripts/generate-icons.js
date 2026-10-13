import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Minimal pure-node PNG generator
function createPNG(width, height, getPixel) {
  // getPixel(x, y) returns [r, g, b, a]
  const bytesPerPixel = 4;
  const scanlineLength = width * bytesPerPixel + 1; // +1 for filter byte
  const rawData = Buffer.alloc(scanlineLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y);
      const pixelOffset = rowOffset + 1 + x * bytesPerPixel;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  function crc32(buf) {
    let crc = 0 ^ -1;
    for (let i = 0; i < buf.length; i++) {
      let byte = buf[i];
      for (let j = 0; j < 8; j++) {
        const bit = (crc ^ (byte >> j)) & 1;
        crc = (crc >>> 1) ^ (bit ? 0xedb88320 : 0);
      }
    }
    return (crc ^ -1) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const combined = Buffer.concat([typeBuf, data]);
    crcBuf.writeUInt32BE(crc32(combined), 0);
    return Buffer.concat([len, combined, crcBuf]);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Draw Solar Crest Icon
function drawNowTechIcon(size, isMaskable = false) {
  const center = size / 2;
  const radius = isMaskable ? size * 0.38 : size * 0.44;

  return createPNG(size, size, (x, y) => {
    // Distance from center
    const dx = x - center;
    const dy = y - center;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Background: Deep Slate #020617
    let r = 2, g = 6, b = 23, a = 255;

    // Outer shield / rounded button shape
    const cornerRadius = size * 0.22;
    const bound = isMaskable ? size * 0.40 : size * 0.45;
    const inBox = Math.abs(dx) <= bound && Math.abs(dy) <= bound;
    
    // Check if within amber solar badge
    const badgeSize = isMaskable ? size * 0.35 : size * 0.38;
    const qx = Math.max(0, Math.abs(dx) - badgeSize + cornerRadius);
    const qy = Math.max(0, Math.abs(dy) - badgeSize + cornerRadius);
    const cornerDist = Math.sqrt(qx * qx + qy * qy);

    if (cornerDist <= cornerRadius && Math.abs(dx) <= badgeSize && Math.abs(dy) <= badgeSize) {
      // Amber Gold Gradient: #fbbf24 to #d97706
      const t = (x + y) / (size * 2);
      r = Math.round(251 * (1 - t) + 217 * t);
      g = Math.round(191 * (1 - t) + 119 * t);
      b = Math.round(36 * (1 - t) + 6 * t);

      // Central dark solar core
      const coreR = size * 0.12;
      const innerCoreR = size * 0.05;

      // Sun rays: 8 rays at 0, 45, 90, 135, 180, 225, 270, 315 deg
      const angle = Math.atan2(dy, dx);
      const angleDeg = (angle * 180 / Math.PI + 360) % 360;
      const rayAngles = [0, 45, 90, 135, 180, 225, 270, 315];
      let onRay = false;
      const rayThickness = size * 0.025;
      const rayMin = size * 0.14;
      const rayMax = size * 0.25;

      for (const ra of rayAngles) {
        let diff = Math.abs(angleDeg - ra);
        if (diff > 180) diff = 360 - diff;
        const distToRay = dist * Math.sin(diff * Math.PI / 180);
        if (distToRay <= rayThickness && dist >= rayMin && dist <= rayMax) {
          onRay = true;
          break;
        }
      }

      if (dist <= innerCoreR) {
        // White energy center
        r = 255; g = 255; b = 255;
      } else if (dist <= coreR || onRay) {
        // Slate-950 dark core & rays
        r = 2; g = 6; b = 23;
      }
    }

    return [r, g, b, a];
  });
}

// Generate files in public directory
const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating PWA icons...');

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), drawNowTechIcon(192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), drawNowTechIcon(512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), drawNowTechIcon(512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), drawNowTechIcon(180, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), drawNowTechIcon(64, false));

// Also write public/icon.svg
const svg = `<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <rect x="76" y="76" width="360" height="360" rx="72" fill="url(#gold)"/>
  <circle cx="256" cy="256" r="64" fill="#020617"/>
  <path d="M256 128 V170 M256 342 V384 M128 256 H170 M342 256 H384 M165 165 L195 195 M317 317 L347 347 M165 347 L195 317 M317 195 L347 165" stroke="#020617" stroke-width="26" stroke-linecap="round"/>
  <circle cx="256" cy="256" r="28" fill="#ffffff"/>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svg);

console.log('Icons generated successfully in public/');
