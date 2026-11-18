import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";

const src = "src/assets/speakerphotos/webp";
const out = "src/assets/speakerphotos/thumbs";
await mkdir(out, { recursive: true });

for (const f of await readdir(src)) {
  if (!/\.(webp|jpe?g|png)$/i.test(f)) continue;
  await sharp(path.join(src, f))
    .resize({ width: 240, height: 240, fit: "cover", position: "top" })
    .webp({ quality: 75 })
    .toFile(path.join(out, f.replace(/\.[^.]+$/, ".webp")));
}
console.log("done");
