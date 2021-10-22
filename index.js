const crypto = require("crypto");
const { createCanvas, loadImage } = require("canvas");
const {
  rmdirSync,
  mkdirSync,
  promises: { writeFile },
} = require("fs");
const {
  DEFAULT_IMAGES_PATH,
  DEFAULT_METADATA_PATH,
  IMAGES_BASE_URI,
  IMAGES_HEIGHT,
  IMAGES_WIDTH,
  TOKEN_NAME_PREFIX,
  TOKEN_DESCRIPTION,
  TOTAL_TOKENS,
  ORDERED_TRAITS_LIST: traitsList,
} = require("./config");

const canvas = createCanvas(IMAGES_WIDTH, IMAGES_HEIGHT);
const ctx = canvas.getContext("2d", { alpha: false });
const uniqueCombinationsHashes = new Set();

const createUniqueTokens = () => {
  return Array.from(Array(TOTAL_TOKENS)).map((_, i) => ({
    tokenId: i,
    traits: createUniqueTraitsCombination(),
  }));
};

const createUniqueTraitsCombination = () => {
  const traits = [];
  traitsList.forEach(({ display, type, options }) => {
    // Filter only options that fulfill their condition (if they have)
    const filteredOptions = options.filter(({ condition }) => {
      if (condition && condition.length > 0) {
        return traits.some(({ value }) => condition.includes(value));
      }
      return true;
    });
    // Randomly select a trait option
    const option = getRandomWeightedOption(filteredOptions);
    // Push selected trait option (if it has a defined value)
    if (option.value) {
      traits.push({
        ...(type && { type }),
        ...(display && { display }),
        ...option,
      });
    }
  });

  const traitsHash = hash(JSON.stringify(traits));
  // Use recursion if the traits combination was already used
  if (uniqueCombinationsHashes.has(traitsHash)) {
    return createUniqueTraitsCombination();
  }
  // Else save the hash and return the traits combination
  uniqueCombinationsHashes.add(traitsHash);
  return traits;
};

const getRandomWeightedOption = (options) => {
  // Transform weights array into an accumulated weights array
  // for instance: [20, 30, 50] --> [20, 50, 100]
  const accWeights = options.reduce(
    (acc, { weight }, i) => acc.concat(weight + (acc[i - 1] || 0)),
    []
  );
  // Select one of the options, based on a rand number
  const rand = Math.random() * accWeights[accWeights.length - 1];
  const index = accWeights.findIndex((accWeight) => rand < accWeight);
  return options[index];
};

const hash = (msg) => crypto.createHash("sha256").update(msg).digest("hex");

const generateTokensFiles = async (tokens) => {
  directoryGuard(DEFAULT_METADATA_PATH);
  directoryGuard(DEFAULT_IMAGES_PATH);
  for (let token of tokens) {
    await generateTokenMetadata(token);
    await generateTokenImage(token);
  }
};

const directoryGuard = (directory) => {
  rmdirSync(directory, { recursive: true });
  mkdirSync(directory, { recursive: true });
};

const generateTokenMetadata = async ({ tokenId, traits }) => {
  const metadata = {
    tokenId,
    name: `${TOKEN_NAME_PREFIX}${tokenId}`,
    ...(TOKEN_DESCRIPTION && { description: TOKEN_DESCRIPTION }),
    image: `${IMAGES_BASE_URI}${tokenId}.png`,
    attributes: traits.map(({ display, type, value }) => ({
      ...(display && { display_type: display }),
      ...(type && { trait_type: type }),
      value,
    })),
  };

  await writeFile(
    `${DEFAULT_METADATA_PATH}${tokenId}`,
    JSON.stringify(metadata, null, 2)
  );
};

const generateTokenImage = async ({ tokenId, traits }) => {
  for (let { image } of traits) {
    if (image) {
      const layerImage = await loadImage(image);
      ctx.drawImage(layerImage, 0, 0);
    }
  }

  await writeFile(
    `${DEFAULT_IMAGES_PATH}${tokenId}.png`,
    canvas.toBuffer("image/png")
  );
};

const printStats = (tokens) => {
  console.log(
    "\nSUCCESS!",
    `\n- images path: ${DEFAULT_IMAGES_PATH}`,
    `\n- metadata path: ${DEFAULT_METADATA_PATH}`,
    `\n\nTOTAL NUMBER OF TOKENS: ${tokens.length}`
  );
  traitsList.forEach(({ type, options }) => {
    console.log(`\nTRAIT TYPE: ${type || "<generic-type>"}`);
    options.forEach(({ value }) => {
      if (value) {
        const amount = tokens.filter(({ traits }) =>
          traits.some(
            (trait) =>
              (type ? trait.type === type : true) && trait.value === value
          )
        ).length;
        const percentage = ((amount / tokens.length) * 100).toFixed(2);
        console.log(
          `- there's ${amount} tokens with value ${value} (${percentage}% of total)`
        );
      }
    });
  });
};

/** MAIN SCRIPT **/
(async () => {
  console.log("Generating unique tokens files. Please wait...");
  try {
    const tokens = createUniqueTokens();
    await generateTokensFiles(tokens);
    printStats(tokens);
  } catch (err) {
    if (err instanceof RangeError) {
      console.log(
        `\nERROR: it was impossible to create ${TOTAL_TOKENS} unique tokens with the current configuration.`,
        "\nTo fix: try lowering the value of TOTAL_TOKENS or update ORDERED_TRAITS_LIST in the config."
      );
    } else throw err;
  }
})();
