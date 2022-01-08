const crypto = require("crypto");
const { createCanvas, loadImage } = require("canvas");
const { rmdirSync, mkdirSync, writeFileSync } = require("fs");
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
  console.log("--> Creating unique tokens...");
  return Array.from(Array(TOTAL_TOKENS)).map((_, i) => ({
    tokenId: i,
    traits: createUniqueTraitsCombination(),
  }));
};

const createUniqueTraitsCombination = () => {
  const traits = [];
  traitsList.forEach(({ display, type, options, ignore }) => {
    // Use only options that fulfill their allowed/forbidden conditions (if they have)
    const filteredOptions = filterOptionsByConditions(options, traits);
    // Randomly select a trait option
    const option = getRandomWeightedOption(filteredOptions);
    // Push selected trait option (if it has a defined value)
    if (option.value) {
      traits.push({
        ...(type && { type }),
        ...(display && { display }),
        ...(ignore && { ignore }),
        ...option,
      });
    }
  });
  // Filter out traits that need to be ignored for uniqueness calculation,
  // and then calculate the hash of the rest of the selected traits combination
  const traitsHash = hash(traits.filter(({ ignore }) => !ignore));
  // Use recursion if the traits combination was already used
  if (uniqueCombinationsHashes.has(traitsHash)) {
    return createUniqueTraitsCombination();
  }
  // Else save the hash and return the traits combination
  uniqueCombinationsHashes.add(traitsHash);
  return traits;
};

const filterOptionsByConditions = (options, traits) => {
  return options.filter(({ allowed, forbidden }) => {
    if (
      allowed &&
      allowed.length > 0 &&
      !traits.some(({ value }) => allowed.includes(value))
    ) {
      return false;
    }
    if (
      forbidden &&
      forbidden.length > 0 &&
      traits.some(({ value }) => forbidden.includes(value))
    ) {
      return false;
    }
    return true;
  });
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

const hash = (object) => {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(object))
    .digest("hex");
};

const generateTokensFiles = async (tokens) => {
  console.log("\n--> Generating tokens files...");
  directoryGuard(DEFAULT_METADATA_PATH);
  directoryGuard(DEFAULT_IMAGES_PATH);
  for (let token of tokens) {
    generateTokenMetadata(token);
    await  generateTokenImage(token);
    process.stdout.write(
      `Current progress: ${Math.round((token.tokenId / TOTAL_TOKENS) * 100)}%\r`
    );
  }
  process.stdout.write(`Current progress: 100%\r`);
};

const directoryGuard = (directory) => {
  rmdirSync(directory, { recursive: true });
  mkdirSync(directory, { recursive: true });
};

const generateTokenMetadata = ({ tokenId, traits }) => {
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
  writeFileSync(
    `${DEFAULT_METADATA_PATH}${tokenId}`,
    JSON.stringify(metadata, null, 2)
  );
};

const generateTokenImage = async ({ tokenId, traits }) => {
  ctx.clearRect(0, 0, canvas.width,canvas.height)
  for (let { image } of traits) {
    if (image) {
      const layerImage = await loadImage(image);
      ctx.drawImage(layerImage, 0, 0);
    }
  }
  writeFileSync(
    `${DEFAULT_IMAGES_PATH}${tokenId}.png`,
    canvas.toBuffer("image/png")
  );
};

const printStats = (tokens) => {
  console.log(`\nTOTAL NUMBER OF TOKENS: ${tokens.length}`);
  traitsList.forEach(({ type, options }) => {
    // Calculate trait stats
    console.log(`\nTRAIT TYPE: ${type || "<generic-type>"}`);
    const traitStats = options.map(({ value }) => {
      const count = tokens.filter(({ traits }) => {
        if (value) {
          return traits.some(
            (trait) =>
              (type ? trait.type === type : true) && trait.value === value
          );
        }
        return !traits.some((trait) => trait.type === type);
      }).length;
      const percentage = `${((count / tokens.length) * 100).toFixed(2)}%`;
      return { value: value || "<none>", count, percentage };
    });
    // Print stats table with traits sorted by rarity (desc)
    console.table(
      traitStats
        .sort((a, b) => a.count - b.count)
        .reduce(
          (acc, { value, count, percentage }) => ({
            ...acc,
            [value]: { count, percentage },
          }),
          {}
        )
    );
  });
};

/** MAIN SCRIPT **/
(async () => {
  try {
    const tokens = createUniqueTokens();
    printStats(tokens);
    await generateTokensFiles(tokens);
    console.log("\n\nSUCCESS!");
  } catch (err) {
    if (err instanceof RangeError) {
      console.log(
        `\nERROR: it was impossible to create ${TOTAL_TOKENS} unique tokens with the current configuration.`,
        "\nTo fix: try lowering the value of TOTAL_TOKENS or update ORDERED_TRAITS_LIST in the config."
      );
    } else throw err;
  }
})();
