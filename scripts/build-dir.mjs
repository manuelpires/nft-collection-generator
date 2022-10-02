import { readdirSync, writeFileSync, appendFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
    
    /*
      use npm run build-dir to build your JSON file
      
      I'm Robbie, and I made this JSON generation tool to save myself time. I hope you
      get some use out of it. Contact me at rbertram@bertramtechnologies.com for any questions, comments or suggestions.

      I will briefly explain the params below:
      
      traitsPath is the base path to your traits, you should not need to change this if you place your traits in this dir
      
      breed is the type of NFT you are creating, IE a type of animal, a shape, or any type of descriptor that fits
      
      the objects array holds the objects created during the JSON generation process, and writes them out to a file
      when the preparation is done

      call addTrait when you are ready to generate a trait, the params for addTrait are as follows:

      type is the type of trait you are generating, IE a background, overlay, underlay and so on

      path is the path to the directory that contains the images for that particular trait

      breed as mentioned before is type of NFT you are creating

      restrictions is an array of strings, each string you enter into this param of addTraits should correspond to the value,
      which will be the file name, of the file you are forbidding the trait in question to be used with; you may also
      change this forbidden to allow when your JSON is generated depending on your rules requirements

    */

    function obj(arg)
    {
      this.type = arg;
      this.options = [];
    }
    const traitsPath = "./traits/";
    const breed = "Shapes";
    var objects = []; 
    
    function addTrait(type, path, breed, restrictions)
    {
      var images = readdirSync(traitsPath + path);
      var standardObject = new obj(type);

      for(var i = 0; i < images.length; i++)
      {
          standardObject.options.push({
            forbidden:restrictions,
            image:traitsPath + path + "/" + images[i],
            value:images[i],
              weight:1,
            });
      }

          objects.push(standardObject);
        }
      
      // addTrait is called, creating the pushing the objects to the objects array
      addTrait("Background", "background", breed, null);
      addTrait("Square", "square", breed, null);
      addTrait("Triangle", "triangle", breed, null);

      // the objects are processed and stringified for JSON generation
      objects = JSON.stringify(objects, null, 4 );
      
      // the objects are finally written to a file you may specify, here it is just ./traits-generated/Traits.json
      appendFileSync(("./traits-generated/Traits.json"), (objects));