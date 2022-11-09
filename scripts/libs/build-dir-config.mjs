import { readdirSync, writeFileSync, Dirent, fstat } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { breed, traitsPath } from "../build-dir.mjs";

let newArray = [];
var objects = []; 
var e = 0;

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
              buildRestrictions([subArgs], path);
            }
            else if(newArg.isDirectory(newArg) != true)
            {
              console.log(newArg.name + " [ " + e++ + " ] ");
              newArray.push(newArg.name);
            }
          }
        }
    }
    if(args.single != null)
    {
      for(var arg of args.single)
      {
        console.log(arg);
        newArray.push(arg);
      }
    }
  return newArray;
}

function generateObjects(type, path, restrictions, images)
{
  var standardObject = new obj(type);
  var restrictions = buildRestrictions(restrictions, path)
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
  //return console.log("Generated " + standardObject.type + " successfully...");
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