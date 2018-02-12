'use strict';
const ora = require('ora');
const { table } = require('../utils/cli');
const { getInternalDependency } = require('../utils/getInternalDependency');
const { getAllPackages } = require('../utils/dir');

async function internal({ cwd, flags }) {
  const spinner = new ora({
    text: 'Calculating internal dependency Data'
  }).start();
  const packages = await getAllPackages(cwd, flags);
  const dependencyTree = await getInternalDependency(cwd, packages);

  let sortedKeys = Object.keys(dependencyTree).sort(
    (maybeSmall, maybeBig) =>
      dependencyTree[maybeBig].length - dependencyTree[maybeSmall].length
  );

  spinner.succeed('Completed with calculation for internal dependency')

  console.log(
    table({
      columns: ['Package Name', 'Dependent Package Count', 'Dependents'],
      rows: sortedKeys.map(key => {
        const extraPackages = Math.max(dependencyTree[key].length - 3, 0);
        const dependentPackagesExtraMessage = `and ${extraPackages} more.`
        return [
          key,
          dependencyTree[key].length,
          `${dependencyTree[key].slice(0, 3)} ${extraPackages > 0 ? dependentPackagesExtraMessage: ''}`,
        ]
      })
    })
  );
}

module.exports = internal;
