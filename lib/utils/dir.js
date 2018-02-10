'use strict';
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readDir = promisify(fs.readdir);
const stat = promisify(fs.stat);

async function isDir(pathName) {
  const s = await stat(pathName);
  return s.isDirectory();
}

async function getDirectories(dirName) {
  const dirContents = await readDir(dirName);
  let dirs = [];

  for (const maybeDir of dirContents) {
    if ( await  isDir(path.join( dirName, maybeDir ))) {
      dirs.push(maybeDir);
    }
  }

  return dirs;
}

module.exports = {
  getDirectories
}
