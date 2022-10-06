import { appendFileSync, readdirSync } from 'node:fs';
import { addTrait, objects } from "./libs/build-dir-config.mjs";
    
    /*
      Use npm run build-dir to build your JSON file
      
      Most of the functionality is hidden, but feel free to tweak this tool's config file at ./libs/build-dr to your liking

      I'm Robbie, and I made this JSON generation tool to save myself time. I hope you
      get some use out of it. Contact me at rbertram@bertramtechnologies.com for any questions, comments or suggestions.

      I will briefly explain the params below:
      
      traitsPath is the base path to your traits, you should not need to change this if you place your traits in this dir
      
      call addTrait when you are ready to generate a trait; the params are as follows:

      function addTrait(type, path, breed, [restrictions])

      type is the type of trait you are generating, IE a background, overlay, underlay and so on

      path is the path to the directory that contains the images for that particular trait

      restrictions is an optional array of arrays containing strings, each string you enter into this param of addTraits should correspond to the value,
      which will be the file name, of the file you are forbidding the trait in question to be used with; you may also
      change this forbidden to allow when your JSON is generated depending on your rules requirements
      
      breed is the type of NFT you are creating, IE a type of animal, a shape, or any type of descriptor that fits
    */

   const traitsPath = "./traits/";
   const breed = "Shapes";
      
      // addTrait is called, creating the pushing the objects to the objects array
      addTrait("Background", "background", breed, 
      [
        // in this top-level array, you can put any number of readdirSync statements if you are forbidding entire directories
        [
          // in this sub-level array, you can put any number of individual additional forbidden images
          // these arrays can be used independently of each-other; one or both can be empty, or you may omit them entirely
          // but do not use null
        ]
      ]);
      addTrait("Square", "square", breed);
      addTrait("Triangle", "triangle", breed);
      
      // the objects are processed and stringified for JSON generation
      var writable = JSON.stringify(objects, null, 4 );
      
      // the objects are finally written to a file you may specify, here it is just ./traits-generated/Traits.json
      appendFileSync(("./traits-generated/Traits.json"), (writable));

      export { traitsPath, breed };