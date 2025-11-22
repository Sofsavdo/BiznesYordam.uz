#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Post-build verification...\n');

// Check dist directory
if (!fs.existsSync('dist')) {
  console.error('❌ dist/ directory not found!');
  process.exit(1);
}

console.log('✅ dist/ exists');
console.log('📂 dist/ contents:');
fs.readdirSync('dist').forEach(item => {
  const stats = fs.statSync(path.join('dist', item));
  console.log(`  ${stats.isDirectory() ? '📁' : '📄'} ${item}`);
});

// Check dist/public
if (!fs.existsSync('dist/public')) {
  console.error('\n❌ dist/public/ directory not found!');
  console.error('   Vite build may have failed');
  process.exit(1);
}

console.log('\n✅ dist/public/ exists');
console.log('📂 dist/public/ contents:');
const publicFiles = fs.readdirSync('dist/public');
publicFiles.forEach(item => {
  const stats = fs.statSync(path.join('dist/public', item));
  console.log(`  ${stats.isDirectory() ? '📁' : '📄'} ${item}`);
});

// Check index.html
if (!fs.existsSync('dist/public/index.html')) {
  console.error('\n❌ dist/public/index.html not found!');
  console.error('   This file is required for the app to work');
  process.exit(1);
}

console.log('\n✅ dist/public/index.html exists');
const indexSize = fs.statSync('dist/public/index.html').size;
console.log(`   Size: ${indexSize} bytes`);

if (indexSize < 100) {
  console.error('⚠️  index.html is suspiciously small!');
}

// Check dist/index.js
if (!fs.existsSync('dist/index.js')) {
  console.error('\n❌ dist/index.js not found!');
  console.error('   Server build may have failed');
  process.exit(1);
}

console.log('\n✅ dist/index.js exists');
const serverSize = fs.statSync('dist/index.js').size;
console.log(`   Size: ${serverSize} bytes`);

// Check for assets directory
if (fs.existsSync('dist/public/assets')) {
  console.log('\n✅ dist/public/assets/ exists');
  const assetFiles = fs.readdirSync('dist/public/assets');
  console.log(`   ${assetFiles.length} asset files found`);
  
  const jsFiles = assetFiles.filter(f => f.endsWith('.js'));
  const cssFiles = assetFiles.filter(f => f.endsWith('.css'));
  
  console.log(`   📜 ${jsFiles.length} JavaScript files`);
  console.log(`   🎨 ${cssFiles.length} CSS files`);
} else {
  console.error('\n⚠️  dist/public/assets/ not found');
  console.error('   This may cause issues loading JS/CSS');
}

console.log('\n✅ Post-build verification passed!');
console.log('🚀 Ready for deployment\n');
