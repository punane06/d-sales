import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const imageJobs = [
  {
    input: 'public/media/products/section3.png',
    output: 'public/media/products/section3.webp',
    width: 560,
    quality: 72,
  },
  {
    input: 'public/media/products/section3-1.png',
    output: 'public/media/products/section3-1.webp',
    width: 560,
    quality: 72,
  },
  {
    input: 'public/media/products/section3-2.png',
    output: 'public/media/products/section3-2.webp',
    width: 560,
    quality: 72,
  },
  {
    input: 'public/media/products/section3-3.png',
    output: 'public/media/products/section3-3.webp',
    width: 560,
    quality: 72,
  },
  {
    input: 'public/media/products/section3-4.png',
    output: 'public/media/products/section3-4.webp',
    width: 560,
    quality: 72,
  },
  {
    input: 'public/media/testimonials/Colombia.jpeg',
    output: 'public/media/testimonials/Colombia.webp',
    width: 160,
    quality: 76,
  },
  {
    input: 'public/media/testimonials/mexico.jpeg',
    output: 'public/media/testimonials/mexico.webp',
    width: 160,
    quality: 76,
  },
  {
    input: 'public/media/testimonials/Peru.jpeg',
    output: 'public/media/testimonials/Peru.webp',
    width: 160,
    quality: 76,
  },
  {
    input: 'public/media/testimonials/USA.jpeg',
    output: 'public/media/testimonials/USA.webp',
    width: 160,
    quality: 76,
  },
  {
    input: 'public/media/testimonials/chile.jpeg',
    output: 'public/media/testimonials/chile.webp',
    width: 160,
    quality: 76,
  },
];

for (const job of imageJobs) {
  const inputPath = path.resolve(job.input);
  const outputPath = path.resolve(job.output);

  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  await sharp(inputPath)
    .resize({ width: job.width, withoutEnlargement: true })
    .webp({ quality: job.quality })
    .toFile(outputPath);

  console.log(`Optimized ${job.input} -> ${job.output}`);
}