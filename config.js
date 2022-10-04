const config = {};
// UPDATE TRAITSLIST TO REFLECT WHERE YOU ARE STORING YOUR GENERATED JSON
const traitsList = require("./traits-generated/Traits");

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
config.TOTAL_TOKENS = 10;

// UPDATE THIS ARRAY BELOW WITH YOUR TRAITS LIST
config.ORDERED_TRAITS_LIST = traitsList;
module.exports = config;
