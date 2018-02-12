'use strict';
const fs = require('fs');
const path = require('path');
const readPkg = require('read-pkg');
const { promisify } = require('util');
const globby = require('globby');
const fileExists = require('file-exists');

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
    if (await isDir(path.join(dirName, maybeDir))) {
      dirs.push(maybeDir);
    }
  }

  return dirs;
}

async function getAllPackages(cwd, flags) {
  let defaultPkgsDirPattern = ['packages/*'];
  let projectDirsPattern = defaultPkgsDirPattern;

  if (flags.lerna) {
    const lernaJson = await readPkg(path.join(cwd, 'lerna.json'));
    projectDirsPattern = lernaJson.packages || defaultPkgsDir;
  } else if (flags.bolt) {
    const pkgJSON = await readPkg(path.join(cwd, 'package.json'));
    projectDirsPattern = (pkgJSON.bolt && pkgJSON.bolt.workspaces) || defaultPkgsDir;
  }

  const projectPkgs = await globby(projectDirsPattern, { nodir: false, gitignore: true });

  return projectPkgs;
}

module.exports = {
  isDir,
  getDirectories,
  getAllPackages,
}
