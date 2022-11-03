import { readdirSync, writeFileSync, Dirent, fstat } from 'node:fs';
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
  return newArray;
}

function generateObjects(type, path, restrictions, images)
{
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
  pushObjects(standardObject);
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
  var restrictions = buildRestrictions(restrictions)
  var filterImages = [];
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