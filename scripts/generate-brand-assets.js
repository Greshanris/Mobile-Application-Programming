/*
  Generates branded image assets for the app using SVG -> PNG rasterization via sharp.
  Assets produced:
    - assets/images/service_icon_logo.png (App icon - 1024x1024)
    - assets/images/adaptive-icon.png (Android adaptive icon foreground - 432x432 transparent)
    - assets/images/favicon.png (Web favicon - 64x64)
    - assets/images/service_icon_splash.png (Splash image - 1242x2436)

  Customize the BRAND configuration below to change colors/text.
*/

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'assets', 'images');

const BRAND = {
  initials: 'LS', // localServiceApp -> LS
  primary: '#0D47A1', // Deep Blue
  accent: '#FFC107', // Amber
  background: '#ffffff', // Splash background
  textColor: '#ffffff',
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function svgIcon({ size, bgColor, text, textColor, circle = true, stroke = null }) {
  const radius = Math.floor(size * 0.42);
  const fontSize = Math.floor(size * 0.46);
  const strokeProps = stroke ? ` stroke="${stroke.color}" stroke-width="${stroke.width}"` : '';
  const circleEl = circle
    ? `<circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="${bgColor}" />`
    : `<rect x="0" y="0" width="${size}" height="${size}" rx="${Math.floor(size * 0.2)}" fill="${bgColor}" />`;

  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs>
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.25)" />
      </filter>
    </defs>
    ${circleEl}
    <text x="50%" y="51%" text-anchor="middle" dominant-baseline="middle" font-family="Inter, Arial, Helvetica, sans-serif" font-weight="700" font-size="${fontSize}" fill="${textColor}"${strokeProps} filter="url(#shadow)">${text}</text>
  </svg>`;
}

function svgForegroundAdaptive({ size, text, textColor, stroke = null }) {
  const fontSize = Math.floor(size * 0.46);
  const strokeProps = stroke ? ` stroke="${stroke.color}" stroke-width="${stroke.width}"` : '';
  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs>
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(0,0,0,0.25)" />
      </filter>
    </defs>
    <text x="50%" y="51%" text-anchor="middle" dominant-baseline="middle" font-family="Inter, Arial, Helvetica, sans-serif" font-weight="800" font-size="${fontSize}" fill="${textColor}"${strokeProps} filter="url(#shadow)">${text}</text>
  </svg>`;
}

function svgSplash({ width, height, bgColor, emblemColor, text, textColor }) {
  const minSide = Math.min(width, height);
  const emblemSize = Math.floor(minSide * 0.28);
  const radius = Math.floor(emblemSize * 0.42);
  const fontSize = Math.floor(emblemSize * 0.46);
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);
  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect x="0" y="0" width="${width}" height="${height}" fill="${bgColor}" />
    <g transform="translate(${centerX}, ${centerY})">
      <circle cx="0" cy="0" r="${radius}" fill="${emblemColor}" />
      <text x="0" y="6" text-anchor="middle" dominant-baseline="middle" font-family="Inter, Arial, Helvetica, sans-serif" font-weight="800" font-size="${fontSize}" fill="${textColor}">${text}</text>
    </g>
  </svg>`;
}

async function writePngFromSvg(svg, outPath) {
  const buffer = Buffer.from(svg);
  await sharp(buffer).png().toFile(outPath);
}

async function main() {
  ensureDir(IMAGES_DIR);

  const icon1024 = path.join(IMAGES_DIR, 'service_icon_logo.png');
  const adaptiveForeground432 = path.join(IMAGES_DIR, 'adaptive-icon.png');
  const favicon64 = path.join(IMAGES_DIR, 'favicon.png');
  const splash1242x2436 = path.join(IMAGES_DIR, 'service_icon_splash.png');

  // App Icon 1024x1024
  const iconSvg = svgIcon({
    size: 1024,
    bgColor: BRAND.primary,
    text: BRAND.initials,
    textColor: BRAND.textColor,
    circle: true,
  });

  // Android Adaptive Foreground 432x432 (transparent background)
  const adaptiveSvg = svgForegroundAdaptive({
    size: 432,
    text: BRAND.initials,
    textColor: BRAND.textColor,
    stroke: { color: BRAND.primary, width: 14 },
  });

  // Favicon 64x64
  const faviconSvg = svgIcon({
    size: 64,
    bgColor: BRAND.primary,
    text: 'L',
    textColor: BRAND.textColor,
    circle: true,
  });

  // Splash 1242x2436 (iPhone X scale) - centered emblem
  const splashSvg = svgSplash({
    width: 1242,
    height: 2436,
    bgColor: BRAND.background,
    emblemColor: BRAND.primary,
    text: BRAND.initials,
    textColor: BRAND.textColor,
  });

  await writePngFromSvg(iconSvg, icon1024);
  console.log('Wrote', icon1024);
  await writePngFromSvg(adaptiveSvg, adaptiveForeground432);
  console.log('Wrote', adaptiveForeground432);
  await writePngFromSvg(faviconSvg, favicon64);
  console.log('Wrote', favicon64);
  await writePngFromSvg(splashSvg, splash1242x2436);
  console.log('Wrote', splash1242x2436);

  console.log('All brand assets generated successfully.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
