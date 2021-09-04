# NFT Collection Generator

## About

This is a simple Node.js project that uses a list of pre-configured traits and image layers to generate a unique set of images and metadata files for a collection of NFTs. You would be able to create your own collection by updating the image layers and the traits configuration.

## Getting Started

### Prerequisites

- [Download and install Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/manuelpires/nft-collection-generator.git
   ```

2. Inside the repo directory install NPM packages

   ```sh
   npm install
   ```

## Usage

There's an example configuration in the `config.js` file, and there's also some pre-defined image layers in the `traits` folder. You can test and run this project with that pre-existing configuration to see first how everything works and to see the results.

### Test the configuration

Test the current configuration in the `config.js` file

```sh
npm test
```

This will only test if the current configuration is correct or not.

### Run the project

Run the project with the current configuration

```sh
npm start
```

This will execute the main script. If successful, it will:

- Print logs with statistics about the results in the console
- Generate a folder with all the tokens images
- Generate a folder with all the tokens metadata files

## Update Configuration and Traits Image Layers

To create your own collection of unique tokens, you'd have to edit only the `config.js` file and update the image layers in the `traits` folder.

The metadata generated by running this project should be compatible with [OpenSea's Metadata Standards](https://docs.opensea.io/docs/metadata-standards). If you are not familiarized with those standards, you should give that page a read as it would help a lot to understand how to update the `config.js` file. Also, make sure to run the project with the example data and check out the generated metadata files for more clarification about the process.

These are the constants that you'd need to update in the `config.js` file:

```JS
config.IMAGES_BASE_URL = "https://base-url-to-my-nft-images.com/";
config.TOKEN_NAME_PREFIX = "My NFT #";
config.TOKEN_DESCRIPTION = "My NFT description.";
config.TOTAL_TOKENS = 100;
```

You'd also have to modify the last constant called `ORDERED_TRAITS_LIST` that contains the array of all available traits for the tokens.
Each _trait_ has the following structure:

```JS
{
  display?: string;
  type?: string;
  options: {
    condition?: string;
    image?: string;
    value?: string | number;
    weight: number;
  }[]
}
```

Before modifying the _traits_ list, please go through the next important considerations:

- For each _trait_ in the list, each generated token will get **one** randomly selected _option_ (_value_ & _image_) from the _options_ list. Except if the randomly selected _option_ for that _trait_ turns out to have a non-existent _value_, in which case the token won't get **anything** from that specific _trait_.
- The order of the list **is important!** It will define in which order the images should be merged on top of each other to create the final token image. Tipically, the background _trait_ should be the first in the array.
- The random selection of the _option_ is based on its _weight_ and its optional _condition_. The _weight_ of an _option_ is **relative** to the _weights_ of the other items in the same _options_ array, and it should be an integer of at least 1. So if you put a _weight_ of 10 in an _option_, it should have 10 more times chances to be selected that an _option_ in the same array that has a _weight_ equal to 1.
- The optional _condition_ string should match the _option value_ of a previous _trait_. When used, it will make this _option_ **only** available for tokens that have that _value_ previously selected. For reference, look at the _condition_ field used as example in the `config.js` file.
- Each defined _type_ inside a _trait_ should be unique.
- If you leave a specific _trait_ without a _type_ field, it will be considered a "generic" _trait_. It's important that these kind of _traits_ don't have any _values_ in common with other _traits_ inside their _options_ array.
- Each _image_ string should have the relative path to a specific PNG image.
- If you don't put an _image_ field in each one of the _options_ with _value_, some of your tokens (even with unique metadata) could turn out with the same generated image.
- Be careful with the _display_ field, they are only meant to be used with number _values_. Read more at the [OpenSea's Metadata Standards](https://docs.opensea.io/docs/metadata-standards).
- Depending on the amount of _traits_ that you have and their amount of _options_, you will have a maximum amount of unique tokens that could be generated. It isn't recommended generating the exact maximum possible amount of unique tokens, because the script will keep searching no matter the odds until it finds each one of the combinations, leaving the weighting factors useless. As a recommendation, I would say that if you want to generate N tokens, then create a list of _traits_ that can give you **at least** 2N tokens. The process will let you know if the value of `TOTAL_TOKENS` is too big when you try to run it.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Manuel Pires - manuelpiresok@gmail.com

Project Link: [https://github.com/manuelpires/nft-collection-generator](https://github.com/manuelpires/nft-collection-generator)
