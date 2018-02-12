'use strict';
const path = require('path');
const readPkg = require('read-pkg');
const globby = require('globby');

async function getAllPackages(cwd, flags = {}) {
  let defaultPkgsDirPattern = ['packages/*'];
  let projectDirsPattern = defaultPkgsDirPattern;

  if (flags.lerna) {
    const lernaJson = await readPkg(path.join(cwd, 'lerna.json'));
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
