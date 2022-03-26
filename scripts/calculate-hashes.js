const crypto = require("crypto");
const { rmdirSync, mkdirSync, readFileSync, writeFileSync } = require("fs");
const {
  DEFAULT_HASHES_PATH,
  DEFAULT_IMAGES_PATH,
  TOTAL_TOKENS,
} = require("../config");

/** CALCULATE IMAGES HASHES SCRIPT **/
(async () => {
  rmdirSync(DEFAULT_HASHES_PATH, { recursive: true });
  mkdirSync(DEFAULT_HASHES_PATH, { recursive: true });

  for (let tokenId = 0; tokenId < TOTAL_TOKENS; tokenId += 1) {
    const image = readFileSync(`${DEFAULT_IMAGES_PATH}${tokenId}.png`);
    const sha256 = crypto.createHash("sha256").update(image).digest("hex");
    writeFileSync(
      `${DEFAULT_HASHES_PATH}${tokenId}.json`,
      JSON.stringify({ tokenId, sha256 }, null, 2)
    );
  }

  console.log(
    `SUCCESS! Created images SHA-256 hashes successfully at: ${DEFAULT_HASHES_PATH} directory`
  );
})();
