'use strict';
const fs = require('fs');
const path = require('path');
const readPkg = require('read-pkg');
const globby = require('globby');
const {promisify} = require('util');
const readFile = promisify(fs.readFile);

async function getAllPackages(cwd, flags = {}) {
  let defaultPkgsDirPattern = ['packages/*'];
  let projectDirsPattern = defaultPkgsDirPattern;

  if (flags.lerna) {
    const lernaConfig = await readFile(path.join(cwd, 'lerna.json'));
    const lernaJson = JSON.parse(lernaConfig);
    projectDirsPattern = lernaJson.packages || defaultPkgsDir;
  } else if (flags.bolt) {
    const pkgJSON = await readPkg(path.join(cwd, 'package.json'));
    projectDirsPattern = (pkgJSON.bolt && pkgJSON.bolt.workspaces) || defaultPkgsDir;
  }
  
  const projectPkgs = await globby(projectDirsPattern, { cwd, nodir: false, gitignore: true });

  return projectPkgs;
}

module.exports = {
  getAllPackages,
}
