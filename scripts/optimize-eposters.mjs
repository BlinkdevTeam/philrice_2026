import sharp from "sharp";
import { mkdirSync, readdirSync, statSync } from "node:fs";
import { join, parse } from "node:path";

const IN = "eposters-src";
const OUT = "src/assets/eposters";
const FULL_W = 2000; // lightbox size. Raise it if tiny text isn't readable
const THUMB_W = 520; // slider size

for (const theme of readdirSync(IN)) {
  const inDir = join(IN, theme);
  if (!statSync(inDir).isDirectory()) continue;
  mkdirSync(join(OUT, theme, "thumbs"), { recursive: true });

  for (const file of readdirSync(inDir)) {
    const { name, ext } = parse(file);
    if (!/^\.(jpe?g|png|webp)$/i.test(ext)) continue;
    const base = name.toLowerCase();
    const img = sharp(join(inDir, file)).rotate();

    await img
      .clone()
      .resize({ width: FULL_W, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(join(OUT, theme, `${base}.webp`));

    await img
      .clone()
      .resize({ width: THUMB_W, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(join(OUT, theme, "thumbs", `${base}.webp`));

    console.log(`${theme}/${base}`);
  }
}
