'use strict';
const got = require('got');
const ora = require('ora');
const chalk = require('chalk');
const { table } = require('../utils/cli');
const { getDirectories, getAllPackages } = require('../utils/dir');
const { getAllPackagesName } = require('../utils/getInternalDependency');

async function getNpmStats(pkg, spinner) {
  try {
    const res = await got(
      `https://api.npmjs.org/downloads/point/last-day/${pkg}`
    );
    spinner.succeed(chalk`Download complete for {green ${pkg}}`);
    return JSON.parse(res.body);
  } catch(error) {
    spinner.fail(chalk`Download failed for {red ${pkg}} with {red ${error}}`);
    return {downloads: 0};
  }
}

async function global({ cwd, flags }) {
  const packages = await getAllPackages(cwd, flags);
  const pkgNames = await getAllPackagesName(cwd, packages);
  let pkgsStat = { };

  for (const pkg of pkgNames) {
    const spinner = ora({
      text: chalk`Downloading data for {yellow ${pkg}}`
    }).start();
    const pkgStats = await getNpmStats(pkg, spinner);
    pkgsStat[pkg] = pkgStats;
  }

  let sortedKeys = Object.keys(pkgsStat).sort(
    (maybeSmall, maybeBig) =>
      pkgsStat[maybeBig].downloads - pkgsStat[maybeSmall].downloads
  );

  console.log(
    table({
      columns: ['', 'Package Name', 'Download'],
      rows: sortedKeys.map((key, index) => [index+1, key, pkgsStat[key].downloads])
    })
  );
}

module.exports = global;
