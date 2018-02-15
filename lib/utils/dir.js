// @flow
'use strict';
const fs = require('fs');
const path = require('path');
const readPkg = require('read-pkg');
const globby = require('globby');
const {promisify} = require('util');

const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

/*::
  type LernaConfigType = {
    packages: Array<string>,
    [Key: string]: mixed,
  }
*/

/*::
  type PackageJsonType = {
    name: string,
    dependencies: { [key: string]: string },
    [key: string]: string | { [key: string]: string },
  }
*/

async function exists(filePath /*: string*/) {
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

async function getAllPackages(cwd /*: string */) {
  const isLernaProject /*: boolean */ = await exists(path.join(cwd, 'lerna.json'));
  let defaultPkgsDirPattern /*: Array<string>*/ = ['packages/*'];
  let projectDirsPattern = defaultPkgsDirPattern;

  if (isLernaProject) {
    const lernaConfig = await readFile(path.join(cwd, 'lerna.json'));
    const lernaJson /*: LernaConfigType */ = JSON.parse(lernaConfig);
    projectDirsPattern = lernaJson.packages || defaultPkgsDirPattern;
  } else {
    const pkgJSON /*: PackageJsonType*/ = await readPkg(path.join(cwd, 'package.json'));
    projectDirsPattern = (pkgJSON.bolt && pkgJSON.bolt.workspaces) || defaultPkgsDirPattern;
  }

  const projectPkgs/*: Array<string> */ = await globby(projectDirsPattern, { cwd, nodir: false, gitignore: true });

  return projectPkgs;
}

module.exports = {
  getAllPackages,
}
