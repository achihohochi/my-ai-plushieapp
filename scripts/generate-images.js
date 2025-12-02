const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// List of all plushie images with their colors
const images = [
  { filename: 'cute-peach-pink-bear-plushie-kawaii.jpg', color: { r: 255, g: 179, b: 217 } },
  { filename: 'cute-lavender-purple-bunny-rabbit-plushie-kawaii.jpg', color: { r: 230, g: 204, b: 255 } },
  { filename: 'cute-mint-green-cat-kitten-plushie-kawaii.jpg', color: { r: 179, g: 255, b: 230 } },
  { filename: 'cute-cotton-candy-pink-blue-puppy-dog-plushie-kawa.jpg', color: { r: 255, g: 179, b: 230 } },
  { filename: 'cute-strawberry-pink-cow-plushie-kawaii.jpg', color: { r: 255, g: 179, b: 179 } },
  { filename: 'cute-baby-blue-penguin-plushie-kawaii.jpg', color: { r: 179, g: 230, b: 255 } },
  { filename: 'cute-yellow-honey-bear-plushie-kawaii-with-bee.jpg', color: { r: 255, g: 244, b: 179 } },
  { filename: 'cute-pastel-rainbow-unicorn-plushie-kawaii.jpg', color: { r: 255, g: 179, b: 255 } },
  { filename: 'cute-pastel-pink-fluffy-cat-plushie-kawaii.jpg', color: { r: 255, g: 204, b: 230 } },
  { filename: 'cute-pastel-blue-bunny-plushie-kawaii-sleeping.jpg', color: { r: 204, g: 230, b: 255 } },
  { filename: 'cute-pastel-yellow-duck-plushie-kawaii.jpg', color: { r: 255, g: 255, b: 204 } },
  { filename: 'cute-pastel-purple-owl-plushie-kawaii.jpg', color: { r: 230, g: 204, b: 255 } },
  { filename: 'cute-kawaii-pink-teddy-bear-plushie-with-bow.jpg', color: { r: 255, g: 179, b: 217 } },
];

const publicDir = path.join(__dirname, '..', 'public');
const size = 800;

// Create a gradient SVG
function createGradientSVG(color) {
  const { r, g, b } = color;
  // Lighter version for gradient
  const r2 = Math.min(255, r + 50);
  const g2 = Math.min(255, g + 50);
  const b2 = Math.min(255, b + 50);
  
  return `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(${r},${g},${b});stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(${r2},${g2},${b2});stop-opacity:1" />
    </linearGradient>
    <filter id="blur">
      <feGaussianBlur in="SourceGraphic" stdDeviation="30"/>
    </filter>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad)"/>
  <circle cx="${size/2}" cy="${size/2}" r="150" fill="rgba(255,255,255,0.3)" filter="url(#blur)"/>
  <circle cx="${size/2}" cy="${size/2}" r="100" fill="rgba(255,255,255,0.2)"/>
</svg>`;
}

// Generate all images
async function generateAll() {
  console.log('🎨 Creating colorful placeholder images with Sharp...\n');
  
  // Clean up SVG files
  images.forEach(img => {
    const svgPath = path.join(publicDir, img.filename.replace('.jpg', '.svg'));
    if (fs.existsSync(svgPath)) {
      fs.unlinkSync(svgPath);
    }
  });
  
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const svg = createGradientSVG(img.color);
    const svgBuffer = Buffer.from(svg);
    
    const filePath = path.join(publicDir, img.filename);
    
    try {
      // Convert SVG to JPG using Sharp
      await sharp(svgBuffer)
        .resize(size, size)
        .jpeg({ quality: 90 })
        .toFile(filePath);
      
      console.log(`✓ Created ${img.filename} (${i + 1}/${images.length})`);
    } catch (error) {
      console.log(`⚠️  Failed to create ${img.filename}: ${error.message}`);
    }
  }
  
  console.log('\n✅ All placeholder images created successfully!');
  console.log('💡 These are colorful gradient placeholders matching each plushie theme.');
  console.log('   Replace them with your original images when available.');
}

generateAll().catch(console.error);

