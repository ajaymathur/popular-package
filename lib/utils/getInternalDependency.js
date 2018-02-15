// @flow
'use strict';
const path = require('path');
const readPkg = require('read-pkg');
const fileExists = require('file-exists');
const pathExists = require('path-exists');

/*::
  type PackageJsonType = {
    name: string,
    dependencies: { [key: string]: string },
    [key: string]: string | { [key: string]: string },
  }
*/

async function getAllPackagesName(cwd /*: string */, pkgPath /*: Array<string> */) {
  const packages = new Set();
  for (const pkg of pkgPath) {
    const doesPathExit /*: boolean */ = await pathExists(path.join(cwd, pkg, 'package.json'));
    if (doesPathExit) {
      const pkgJson /*: PackageJsonType */ = await readPkg(path.join(cwd, pkg));
      if (!pkgJson.private) {
        packages.add(pkgJson.name);
      }
    }
  }
  return packages;
}

async function getInternalDependency(cwd /*: string */, packages /*: Array<string> */) {
  let dependentGraph /*: { [key: string]: Array<string> }*/= {};
  const allPackages = await getAllPackagesName(cwd, packages);

  for (const pkg of packages) {
    const pathExit /*: boolean*/ = await pathExists(path.join(cwd, pkg, 'package.json'));

    if (pathExit) {
      const pkgJson /*: PackageJsonType */ = await readPkg(path.join(cwd, pkg));
      
      if (pkgJson.dependencies) {
        Object.keys(pkgJson.dependencies).map(dependency => {
          if (allPackages.has(dependency)) {
            dependentGraph[dependency]
              ? dependentGraph[dependency].push(pkgJson.name)
              : (dependentGraph[dependency] = [pkgJson.name]);
          }
        });
      }
    }
  }

  return dependentGraph;
}

module.exports = {
  getAllPackagesName,
  getInternalDependency,
};
