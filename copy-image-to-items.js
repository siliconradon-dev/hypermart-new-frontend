// copy-image-to-items.js
// Usage: node copy-image-to-items.js <source-image-path>
// Copies the given image to public/images/upload/items and prints the relative path to use in the database.

const fs = require('fs');
const path = require('path');

if (process.argv.length < 3) {
  console.error('Usage: node copy-image-to-items.js <source-image-path>');
  process.exit(1);
}

const srcPath = path.resolve(process.argv[2]);
const destDir = path.resolve(__dirname, 'public', 'images', 'upload', 'items');
const fileName = path.basename(srcPath);
const destPath = path.join(destDir, fileName);

if (!fs.existsSync(srcPath)) {
  console.error('Source file does not exist:', srcPath);
  process.exit(1);
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(srcPath, destPath);
console.log('Image copied to:', destPath);
console.log('Use this path in the database: images/upload/items/' + fileName);
