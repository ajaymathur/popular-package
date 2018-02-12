'use strict';
const path = require('path');
const readPkg = require('read-pkg');
const fileExists = require('file-exists');
const pathExists = require('path-exists');

async function getAllPackagesName(cwd, pkgPath) {
  const packages = new Set();
  for (const pkg of pkgPath) {
    const doesPathExit = await pathExists(path.join(cwd, pkg, 'package.json'));
    if (doesPathExit) {
      const pkgJson = await readPkg(path.join(cwd, pkg));
      if (!pkgJson.private) {
        packages.add(pkgJson.name);
      }
    }
  }
  return packages;
}

async function getInternalDependency(cwd, packages) {
  let dependentGraph = {};
  const allPackages = await getAllPackagesName(cwd, packages);

  for (const pkg of packages) {
    const pathExit = await pathExists(path.join(cwd, pkg, 'package.json'));

    if (pathExit) {
      const pkgJson = await readPkg(path.join(cwd, pkg));
      
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
