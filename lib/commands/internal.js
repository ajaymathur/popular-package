'use strict';
const { table } = require('../utils/cli');
const getInternalDependency = require('../utils/getInternalDependency');
const { getDirectories } = require('../utils/dir');

async function internal({ pkgsDir, flags }) {
  const packages = await getDirectories(pkgsDir);
  const dependencyTree = await getInternalDependency(pkgsDir, packages);

  let sortedKeys = Object.keys(dependencyTree).sort(
    (maybeSmall, maybeBig) =>
      dependencyTree[maybeBig].length - dependencyTree[maybeSmall].length
  );

  console.log(
    table({
      columns: ['Package Name', 'Dependent Package Count', 'Dependents'],
      rows: sortedKeys.map(key => [
        key,
        dependencyTree[key].length,
        dependencyTree[key].join(' ,')
      ])
    })
  );
}

module.exports = internal;
