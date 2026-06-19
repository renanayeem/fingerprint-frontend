const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const distDir = path.join(
  __dirname,
  '../dist/fingerprint-frontend/browser'
);

if (!fs.existsSync(distDir)) {
  console.log(`Build folder not found: ${distDir}`);
  process.exit(1);
}

const files = fs.readdirSync(distDir);

files
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    const filePath = path.join(distDir, file);

    const source = fs.readFileSync(filePath, 'utf8');

    const obfuscated = JavaScriptObfuscator.obfuscate(source, {
      compact: true,
      rotateStringArray: true,
      stringArray: true,
      stringArrayThreshold: 0.75
    }).getObfuscatedCode();

    fs.writeFileSync(filePath, obfuscated);

    console.log(`Obfuscated ${file}`);
  });