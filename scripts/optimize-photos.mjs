import sharp from "sharp";
import { readdirSync } from "node:fs";
import { join, parse } from "node:path";

const dir = "src/assets/photos";

for (const file of readdirSync(dir)) {
  const { name, ext } = parse(file);
  if (!/^\.jpe?g$/i.test(ext)) continue;

  await sharp(join(dir, file))
    .rotate() // respects the camera's orientation
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(join(dir, `${name.toLowerCase()}.webp`));
}
