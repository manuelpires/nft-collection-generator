import { readdirSync, writeFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { breed, traitsPath } from "../build-dir.mjs";

var objects = []; 

function obj(arg)
{
  this.type = arg;
  this.options = [];
}

function buildRestrictions(args = null)
{
  var newArray = [];
  if(args != null)
  {
    for(var i = 0; i < args.length; i++)
    {
      for(var s = 0; s < args[i].length; s++)
      {  
        newArray.push(args[i][s]);
      }
    }
  }
  console.log(newArray)
  return newArray;
}


function addTrait(type, path, breed, restrictions)
{
  var images = readdirSync(traitsPath + path);
  var standardObject = new obj(type);

  var restrictions = buildRestrictions(restrictions)

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
      return objects;
    }

    export { addTrait, obj, buildRestrictions, objects };