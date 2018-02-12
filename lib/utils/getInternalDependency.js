'use strict';
const path = require('path');
const readPkg = require('read-pkg');
const fileExists = require('file-exists');
const pathExists = require('path-exists');
const { isDir } = require('./dir');

async function getAllPackagesName(packagesPath, pkgPath) {
  const packages = new Set();
  for (const pkg of pkgPath) {
    const doesPathExit = await pathExists(path.join(packagesPath, pkg, 'package.json'));
    if (doesPathExit) {
      const pkgJson = await readPkg(path.join(packagesPath, pkg));
      packages.add(pkgJson.name);
    }
  }
  return packages;
}

async function getInternalDependency(packagesPath, packages) {
  let dependentGraph = {};
  const allPackages = await getAllPackagesName(packagesPath, packages);
  for (const pkg of packages) {
    const doesPathExit = await pathExists(path.join(packagesPath, pkg, 'package.json'));
    if (doesPathExit) {
      const pkgJson = await readPkg(path.join(packagesPath, pkg));
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
