import { writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { addTrait, objects } from "./libs/build-dir-config.mjs";
    
    /*
      Use npm run build-dir to build your JSON file
      
      Most of the functionality is hidden, but feel free to tweak this tool's config file at ./libs/build-dr to your liking

      I'm Robbie, and I made this JSON generation tool to save myself time. I hope you
      get some use out of it. Contact me at rbertram@bertramtechnologies.com for any questions, comments or suggestions.

      I will briefly explain the params below:
      
      traitsPath is the base path to your traits, you should not need to change this if you place your traits in this dir
      
      jsonPath is the base path to where you want your JSON generated

      traitsFile is the name you want for your generated JSON file; you do not need to enter the file suffix, it will be appended for you

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
   const jsonPath = "./traits-json/";
   const breed = "Shapes";
   var traitsFile = "Traits";
   
   traitsFile += ".json";
      
      // addTrait is called, creating the pushing the objects to the objects array
      addTrait("Background", "background", breed,
      // the restrictions object contains multi and single members
      // multi contains strings representing the name of or path to the top-level folder in the
      // directory(ies) you want to forbid for the given trait
      // single contains strings representing the name of or path to a single image you want to
      // forbid; you may include multiple comma-separated entries in each array
      {
        multi:[
          // path/to/example/forbidden/folder(s)
        ],
        single:[
          // exampleForbiddenTrait.*
        ],
      }
      );
      addTrait("Square", "square", breed);
      addTrait("Triangle", "triangle", breed);
      
      // the objects are processed and stringified for JSON generation
      var writable = JSON.stringify(objects, null, 4 );
      
      if(existsSync(jsonPath) != true)
      {
        mkdirSync(jsonPath);
      }

      // the objects are finally written to a file you may specify, here it is just ./traits-generated/Traits.json
      writeFileSync((jsonPath + traitsFile), (writable));

      console.log("Output successfully written to " + jsonPath + traitsFile);

      export { traitsPath, breed };