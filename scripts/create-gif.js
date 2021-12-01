const { writeFileSync } = require("fs");
const { createCanvas, loadImage } = require("canvas");
const GifEncoder = require("gif-encoder-2");
const {
  DEFAULT_IMAGES_PATH,
  GIF_FRAMES,
  IMAGES_HEIGHT,
  IMAGES_WIDTH,
  TOTAL_TOKENS,
} = require("../config");

const canvas = createCanvas(IMAGES_WIDTH, IMAGES_HEIGHT);
const ctx = canvas.getContext("2d", { alpha: false });

const usedTokenIds = new Set();

/** CREATE GIF SCRIPT **/
(async () => {
  const gifEncoder = new GifEncoder(
    IMAGES_WIDTH,
    IMAGES_HEIGHT,
    "octree",
    false
  );

  const tokenIds = Array.from(Array(GIF_FRAMES)).map((_) => {
    let tokenId;
    do {
      tokenId = Math.floor(Math.random() * TOTAL_TOKENS);
    } while (usedTokenIds.has(tokenId));
    usedTokenIds.add(tokenId);
    return tokenId;
  });

  gifEncoder.setDelay(500);
  gifEncoder.setRepeat(0);
  gifEncoder.start();

  for (let tokenId of tokenIds) {
    const frame = await loadImage(`${DEFAULT_IMAGES_PATH}${tokenId}.png`);
    ctx.drawImage(frame, 0, 0);
    gifEncoder.addFrame(ctx);
  }

  gifEncoder.finish();

  const buffer = gifEncoder.out.getData();
  writeFileSync("preview.gif", buffer);

  console.log(
    `Created GIF at ./preview.gif width tokenIds: ${tokenIds.join(" ")}`
  );
})();
