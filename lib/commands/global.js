'use strict';
const got = require('got');
const ora = require('ora');
const chalk = require('chalk');
const { table } = require('../utils/cli');
const { getAllPackages } = require('../utils/dir');
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

async function global({ cwd }) {
  const spinner = ora({
    text: chalk`Getting packages to download stats for`
  }).start();
  const packages = await getAllPackages(cwd);
  const pkgNames = await getAllPackagesName(cwd, packages);
  let pkgsStat = { };

  spinner.succeed(chalk`Found {green ${pkgNames.size}} packages`);

  for (const pkg of pkgNames) {
    spinner.start(chalk`Downloading npm data for {yellow ${pkg}}`);
    const pkgStats = await getNpmStats(pkg, spinner);
    pkgsStat[pkg] = pkgStats;
  }

  let sortedKeys = Object.keys(pkgsStat).sort(
    (maybeSmall, maybeBig) =>
      pkgsStat[maybeBig].downloads - pkgsStat[maybeSmall].downloads
  );

  console.log(
    table({
      columns: ['', chalk`{yellow Package Name}`, chalk`{yellow Download}`],
      rows: sortedKeys.map((key, index) => [index+1, key, pkgsStat[key].downloads])
    })
  );
}

module.exports = global;
