import { readdirSync, writeFileSync, Dirent, fstat } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { breed, traitsPath } from "../build-dir.mjs";

let newArray = [];
var objects = []; 

function obj(arg)
{
  this.type = arg;
  this.options = [];
}

function buildRestrictions(args = { single:null, multi:null }, path = null)
{
  if(args.multi != null)
  {
    for(var arg of args.multi)
    {
      var argPath = traitsPath + arg;
      
          var newArgs = readdirSync(argPath, {withFileTypes:true });
          
          for(var newArg of newArgs)
          {
            if(newArg.isDirectory(newArg) == true)
            {
              var subArgs = arg + "/" + newArg.name;
              buildRestrictions({ multi:[subArgs] }, path);
            }
            else if(newArg.isDirectory(newArg) != true)
            {
              newArray.push(newArg.name);
            }
          }
        }
      }
      if(args.single != null)
      {
        for(var arg of args.single)
        {
          newArray.push(arg);
        }
      }
    return newArray;
  }

function generateObjects(type, path, restrictions, images)
{
  
  var standardObject = new obj(type);
  
  // push a dummy image to be used when a future trait forbidden by the current one needs to be generated further down the line
  pushDummy(type, path, standardObject);

  for(var image of images)
  {
      standardObject.options.push({
      forbidden:restrictions,
      image:traitsPath + path + "/" + image,
      value:image,
      weight:1,
    });
  }

  pushObjects(standardObject);
}
// ccrtfunction pushDummy(type, path, standardObject, restrictions)
{
  standardObject.options.push({
    forbidden:null,
    image:traitsPath + "dummy.png",
    value:type + "Dummy.png",
      weight:1,
    });

    return standardObject;
}

function pushObjects(standardObject)
{
  objects.push(standardObject);
  return console.log("Generated " + standardObject.type + " successfully...");
}

function ifDir(dir, path, type, restrictions)
{
  let images = readdirSync(traitsPath + path + "/" + dir);
  var filterImages = [];
  path += "/";
  path += dir;
  type += "/";
  type += dir;
  for(var i = 0; i < images.length; i++)
  {
    if(images[i].isDirectory == true)
    {
      ifDir(images[i], path)
    }
    else if(images[i].isDirectory != true)
    {
      filterImages.push(images[i]);
    }
  }
  generateObjects(type, path, restrictions, filterImages);
}

function addTrait(type, path, breed, restrictions)
{
  var images = readdirSync(traitsPath + path, { withFileTypes:true });
  var filterImages = [];

  if(restrictions != null)
  {
    var restrictions = buildRestrictions(restrictions, path);
  }
  for(var i = 0; i < images.length; i++)
  {
    if(images[i].isDirectory() == true)
    {
      ifDir(images[i].name, path, type, restrictions);
    }
    else if(images[i].isDirectory() == false)
    {
      filterImages.push(images[i].name);
    }
  }
  if(filterImages.length > 0)
  {
    generateObjects(type, path, restrictions, filterImages)
  }
}

    export { addTrait, obj, buildRestrictions, objects };