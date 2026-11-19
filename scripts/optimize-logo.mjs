import sharp from "sharp";

await sharp("src/assets/da-philrice.png")
  .resize({ height: 240 }) // 3x the displayed height, sharp on retina screens
  .webp({ quality: 88 })
  .toFile("src/assets/da-philrice.webp");
