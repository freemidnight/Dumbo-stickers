const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://raw.githubusercontent.com/freemidnight/Dumbo-stickers/main/';
const EXTENSIONS = ['.png', '.gif', '.webp'];
const SKIP_DIRS = ['.git', 'node_modules'];
const ROOT_DIR = __dirname;

function scanDir(dir, rootDir) {
  const stickers = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.includes(entry.name)) {
        stickers.push(...scanDir(fullPath, rootDir));
      }
    } else if (EXTENSIONS.includes(path.extname(entry.name).toLowerCase())) {
      stickers.push(path.relative(rootDir, fullPath).replace(/\\/g, '/'));
    }
  }
  return stickers;
}

const stickers = scanDir(ROOT_DIR, ROOT_DIR);

const output = {
  baseUrl: BASE_URL,
  stickers,
};

fs.writeFileSync(
  path.join(ROOT_DIR, 'stickers.json'),
  JSON.stringify(output, null, 2)
);

console.log(`Generated stickers.json with ${stickers.length} stickers.`);
