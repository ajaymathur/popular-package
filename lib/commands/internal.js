// @flow
'use strict';
const ora = require('ora');
const chalk = require('chalk');
const { table } = require('../utils/cli');
const { getInternalDependency } = require('../utils/getInternalDependency');
const { getAllPackages } = require('../utils/dir');

async function internal({ cwd } /*: {cwd: string}*/) {
  const spinner = new ora({
    text: 'Calculating internal dependency Data'
  }).start();
  const packages = await getAllPackages(cwd);
  const dependencyTree = await getInternalDependency(cwd, packages);

  let sortedKeys = Object.keys(dependencyTree).sort(
    (maybeSmall, maybeBig) =>
      dependencyTree[maybeBig].length - dependencyTree[maybeSmall].length
  );

  spinner.succeed('Completed with calculation for internal dependency')

  console.log(
    table({
      columns: ['', chalk`{yellow Package Name}`, chalk`{yellow Dependent Packages Count}`, chalk`{yellow Dependent Packages}`],
      rows: sortedKeys.map((key, index) => {
        const extraPackages = Math.max(dependencyTree[key].length - 3, 0);
        const dependentPackagesExtraMessage = `and ${extraPackages} more.`
        return [
          index+1,
          key,
          dependencyTree[key].length,
          chalk`${dependencyTree[key].slice(0, 3)} {green ${extraPackages > 0 ? dependentPackagesExtraMessage: ''}}`,
        ]
      })
    })
  );
}

module.exports = internal;
