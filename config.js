const config = {};

config.DEFAULT_IMAGES_PATH = "./images/";
config.DEFAULT_METADATA_PATH = "./metadata/";
config.DEFAULT_HASHES_PATH = "./hashes/";

// UPDATE THESE CONSTANTS BELOW WITH YOUR VALUES
config.GIF_FRAMES = 10;
config.IMAGES_BASE_URI = "https://base-uri-to-my-nft-images.com/";
config.IMAGES_HEIGHT = 350;
config.IMAGES_WIDTH = 350;
config.TOKEN_NAME_PREFIX = "My NFT #";
config.TOKEN_DESCRIPTION = "My NFT description.";
config.TOTAL_TOKENS = 100;

// UPDATE THIS ARRAY BELOW WITH YOUR TRAITS LIST
config.ORDERED_TRAITS_LIST = [
  {
    type: "Background",
    options: [
      {
        image: "./traits/background/baby-purple.png",
        value: "Baby Purple",
        weight: 1,
      },
      {
        image: "./traits/background/butter.png",
        value: "Butter",
        weight: 1,
      },
      {
        image: "./traits/background/coral.png",
        value: "Coral",
        weight: 1,
      },
      {
        image: "./traits/background/mint.png",
        value: "Mint",
        weight: 1,
      },
      {
        image: "./traits/background/robin.png",
        value: "Robin",
        weight: 1,
      },
    ],
  },
  {
    type: "Square",
    options: [
      {
        image: "./traits/square/bright-coral.png",
        value: "Bright Coral",
        weight: 1,
      },
      {
        image: "./traits/square/liliac.png",
        value: "Liliac",
        weight: 1,
      },
      {
        image: "./traits/square/pumpkin.png",
        value: "Pumpkin",
        weight: 1,
      },
      {
        image: "./traits/square/spring.png",
        value: "Spring",
        weight: 1,
      },
      {
        weight: 1,
      },
    ],
  },
  {
    type: "Triangle",
    options: [
      {
        image: "./traits/triangle/brick.png",
        value: "Brick",
        weight: 1,
      },
      {
        image: "./traits/triangle/green.png",
        value: "Green",
        weight: 1,
      },
      {
        allowed: ["Coral", "Mint"],
        image: "./traits/triangle/orchid.png",
        value: "Orchid",
        weight: 1,
      },
      {
        forbidden: ["Robin"],
        image: "./traits/triangle/teal.png",
        value: "Teal",
        weight: 1,
      },
      {
        weight: 1,
      },
    ],
  },
];

module.exports = config;
