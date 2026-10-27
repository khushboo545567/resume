// One-time script: converts template PNGs to resized WebP and updates imports.
// Usage: npm run optimize:images
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const DIR = "src/assets/templates";
const MAX_WIDTH = 800; // thumbnails don't need more
const QUALITY = 80;

// 1) convert every PNG to WebP
const pngs = fs.readdirSync(DIR).filter((f) => f.toLowerCase().endsWith(".png"));

if (pngs.length === 0) {
  console.log("No PNG files found in", DIR);
}

let totalBefore = 0;
let totalAfter = 0;

for (const file of pngs) {
  const input = path.join(DIR, file);
  const output = path.join(DIR, file.replace(/\.png$/i, ".webp"));
  const before = fs.statSync(input).size;

  await sharp(input)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(output);

  const after = fs.statSync(output).size;
  totalBefore += before;
  totalAfter += after;
  console.log(`${file}: ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB`);
  fs.unlinkSync(input); // old PNG stays available in git history
}

console.log(
  `\nTotal: ${(totalBefore / 1048576).toFixed(1)} MB -> ${(totalAfter / 1048576).toFixed(1)} MB`,
);

// 2) update imports in source files
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

for (const f of walk("src").filter((f) => /\.(ts|tsx)$/.test(f))) {
  const src = fs.readFileSync(f, "utf8");
  const out = src.replace(/(assets\/templates\/[^"'`]+)\.png/gi, "$1.webp");
  if (out !== src) {
    fs.writeFileSync(f, out);
    console.log("updated imports in", f);
  }
}
