#!/usr/bin/env node
/**
 * Converts all PNG images in public/assets/img/ to WebP format.
 * Keeps the original PNGs as fallbacks.
 *
 * Usage: node scripts/convert-to-webp.mjs
 */
import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';

const IMG_DIR = 'public/assets/img';
const QUALITY = 80; // WebP quality (0-100)

async function convertAll() {
  const files = await readdir(IMG_DIR);
  const pngs = files.filter((f) => extname(f).toLowerCase() === '.png');

  console.log(`Found ${pngs.length} PNG files to convert\n`);

  let totalPng = 0;
  let totalWebp = 0;

  for (const file of pngs) {
    const inputPath = join(IMG_DIR, file);
    const outputPath = join(IMG_DIR, basename(file, '.png') + '.webp');

    await sharp(inputPath).webp({ quality: QUALITY }).toFile(outputPath);

    const pngSize = (await stat(inputPath)).size;
    const webpSize = (await stat(outputPath)).size;
    const savings = ((1 - webpSize / pngSize) * 100).toFixed(1);

    totalPng += pngSize;
    totalWebp += webpSize;

    console.log(
      `${file} → ${basename(outputPath)}  ` +
        `${(pngSize / 1024).toFixed(0)}KB → ${(webpSize / 1024).toFixed(0)}KB  ` +
        `(${savings}% smaller)`
    );
  }

  console.log(
    `\nTotal: ${(totalPng / 1024 / 1024).toFixed(1)}MB → ${(totalWebp / 1024 / 1024).toFixed(1)}MB  ` +
      `(${((1 - totalWebp / totalPng) * 100).toFixed(1)}% smaller)`
  );
}

convertAll().catch((err) => {
  console.error('Conversion failed:', err);
  process.exit(1);
});
