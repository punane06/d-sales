// Run with: node scripts/convert-mexico-images.js
const sharp = require('sharp');

async function run() {
  await sharp('public/media/testimonials/mexico2.jpg')
    .resize(400, 400, { fit: 'cover' })
    .toFile('public/media/testimonials/mexico.webp');
  console.log('Created mexico.webp (400x400)');

  await sharp('public/media/testimonials/mexico2.jpg')
    .resize(600, 800, { fit: 'cover' })
    .toFile('public/media/testimonials/mexico-portrait.webp');
  console.log('Created mexico-portrait.webp (600x800)');
}

run().catch(err => { console.error(err); process.exit(1); });
