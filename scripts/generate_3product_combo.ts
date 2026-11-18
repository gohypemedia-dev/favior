import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function getTransparentBuffer(filePath: string): Promise<Buffer> {
  const { data, info } = await sharp(filePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const visited = new Uint8Array(width * height);
  const queue: number[] = [];

  function isWhite(x: number, y: number): boolean {
    const idx = (y * width + x) * 4;
    return data[idx] > 245 && data[idx + 1] > 245 && data[idx + 2] > 245;
  }

  // Seed flood fill from the 4 outer perimeter borders
  for (let x = 0; x < width; x++) {
    if (isWhite(x, 0)) {
      queue.push(x, 0);
      visited[x] = 1;
    }
    if (isWhite(x, height - 1)) {
      queue.push(x, height - 1);
      visited[(height - 1) * width + x] = 1;
    }
  }
  for (let y = 0; y < height; y++) {
    if (isWhite(0, y) && !visited[y * width]) {
      queue.push(0, y);
      visited[y * width] = 1;
    }
    if (isWhite(width - 1, y) && !visited[y * width + width - 1]) {
      queue.push(width - 1, y);
      visited[y * width + width - 1] = 1;
    }
  }

  let head = 0;
  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];
    const idx = (cy * width + cx) * 4;
    data[idx + 3] = 0; // set alpha to transparent

    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1],
    ];
    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const vidx = ny * width + nx;
        if (!visited[vidx] && isWhite(nx, ny)) {
          visited[vidx] = 1;
          queue.push(nx, ny);
        }
      }
    }
  }

  return sharp(data, { raw: info }).png().toBuffer();
}

async function main() {
  console.log('Generating combo images from the 3 real backend products...');
  console.log('1. Favior Heritage Gym Duffle Bag (/favior_heritage_duffle_bag.jpg)');
  console.log('2. Favior Phantom Shaker (/favior_pro_shaker_black.jpg)');
  console.log('3. Favior Luxury Gym Towel (/favior_luxury_towel.jpg)');

  const [bagTrans, blackShakerTrans, towelTrans] = await Promise.all([
    getTransparentBuffer('public/favior_heritage_duffle_bag.jpg'),
    getTransparentBuffer('public/favior_pro_shaker_black.jpg'),
    getTransparentBuffer('public/favior_luxury_towel.jpg'),
  ]);

  // ─────────────────────────────────────────────────────────────
  // 1. PRODUCT CARD COMBO IMAGE: 1200 x 1200 (Square, Clean White)
  // ─────────────────────────────────────────────────────────────
  const cardSize = 1200;

  // Duffle bag in center-back
  const cardBag = await sharp(bagTrans)
    .resize(820, 820, { fit: 'contain' })
    .png()
    .toBuffer();

  // Stealth Black shaker in front left
  const cardShaker = await sharp(blackShakerTrans)
    .resize(550, 550, { fit: 'contain' })
    .png()
    .toBuffer();

  // Luxury towel box in front right
  const cardTowel = await sharp(towelTrans)
    .resize(560, 560, { fit: 'contain' })
    .png()
    .toBuffer();

  // Composite 3 products into 1200x1200
  // Bag: top: 110, left: 190 (centered anchor)
  // Shaker: top: 460, left: 170 (front-left overlap)
  // Towel: top: 520, left: 540 (front-right overlap)
  await sharp({
    create: {
      width: cardSize,
      height: cardSize,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([
      { input: cardBag, left: 190, top: 110 },
      { input: cardShaker, left: 170, top: 460 },
      { input: cardTowel, left: 540, top: 520 },
    ])
    .jpeg({ quality: 96 })
    .toFile('public/favior_complete_gym_kit.jpg');

  console.log('SUCCESS: Generated public/favior_complete_gym_kit.jpg');

  // Copy to brain artifacts dir as well
  const artifactPath =
    'C:\\Users\\HP\\.gemini\\antigravity\\brain\\4eaeba7e-1aa9-4e41-be89-cdff0612fb46\\favior_complete_gym_kit.jpg';
  try {
    fs.copyFileSync('public/favior_complete_gym_kit.jpg', artifactPath);
    console.log('Copied to artifacts:', artifactPath);
  } catch (e) {
    console.warn('Could not copy to artifacts:', e);
  }

  // ─────────────────────────────────────────────────────────────
  // 2. BUILD YOUR KIT BANNER: 2560 x 900 (Wide Banner, Clean White)
  // ─────────────────────────────────────────────────────────────
  const bannerWidth = 2560;
  const bannerHeight = 900;

  const bannerBag = await sharp(bagTrans)
    .resize(850, 850, { fit: 'contain' })
    .png()
    .toBuffer();

  const bannerShaker = await sharp(blackShakerTrans)
    .resize(600, 600, { fit: 'contain' })
    .png()
    .toBuffer();

  const bannerTowel = await sharp(towelTrans)
    .resize(680, 680, { fit: 'contain' })
    .png()
    .toBuffer();

  // Layout for wide banner:
  // Bag on left-center: left: 340, top: 50
  // Shaker in center: left: 1160, top: 180
  // Towel on right-center: left: 1680, top: 140
  await sharp({
    create: {
      width: bannerWidth,
      height: bannerHeight,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([
      { input: bannerBag, left: 340, top: 50 },
      { input: bannerShaker, left: 1160, top: 180 },
      { input: bannerTowel, left: 1680, top: 140 },
    ])
    .jpeg({ quality: 96 })
    .toFile('public/favior_combo_pack_banner.jpg');

  console.log('SUCCESS: Generated public/favior_combo_pack_banner.jpg');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
