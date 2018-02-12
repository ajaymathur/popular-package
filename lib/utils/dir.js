'use strict';
const fs = require('fs');
const path = require('path');
const readPkg = require('read-pkg');
const globby = require('globby');
const {promisify} = require('util');

const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }
  return false;
}

async function getAllPackages(cwd, flags = {}) {
  let defaultPkgsDirPattern = ['packages/*'];
  let projectDirsPattern = defaultPkgsDirPattern;

  const isLernaProject = await exists(path.join(cwd, 'lerna.json'));

  if (isLernaProject) {
    const lernaConfig = await readFile(path.join(cwd, 'lerna.json'));
    const lernaJson = JSON.parse(lernaConfig);
  } else {
    const pkgJSON = await readPkg(path.join(cwd, 'package.json'));
    projectDirsPattern = (pkgJSON.bolt && pkgJSON.bolt.workspaces) || defaultPkgsDir;
  }

  const projectPkgs = await globby(projectDirsPattern, { cwd, nodir: false, gitignore: true });

  return projectPkgs;
}

module.exports = {
  getAllPackages,
}
