'use strict';
const path = require('path');
const readPkg = require('read-pkg');

async function getInternalDependency(packagesPath, packages) {
  let dependentGraph = {};
  for (const pkg of packages) {
    const pkgJson = await readPkg(path.join(packagesPath, pkg));
    if (pkgJson.dependencies) {
      Object.keys(pkgJson.dependencies).map(dependency => {
        if (packages.indexOf(dependency) > -1) {
          dependentGraph[dependency]
            ? dependentGraph[dependency].push(pkg)
            : (dependentGraph[dependency] = [pkg]);
        }
      });
    }
  }

  return dependentGraph;
}

module.exports = getInternalDependency;
