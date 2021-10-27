const { readFileSync, writeFileSync } = require("fs");
const {
  DEFAULT_METADATA_PATH,
  IMAGES_BASE_URI,
  TOTAL_TOKENS,
} = require("./config");

/** UPDATE BASE URI SCRIPT **/
(() => {
  for (let tokenId = 0; tokenId < TOTAL_TOKENS; tokenId += 1) {
    const data = readFileSync(`${DEFAULT_METADATA_PATH}${tokenId}`);
    const json = {
      ...JSON.parse(data),
      image: `${IMAGES_BASE_URI}${tokenId}`,
    };
    writeFileSync(
      `${DEFAULT_METADATA_PATH}${tokenId}`,
      JSON.stringify(json, null, 2)
    );
  }
  console.log(
    `SUCCESS! Images base URI in metadata files updated to: ${IMAGES_BASE_URI}`
  );
})();
