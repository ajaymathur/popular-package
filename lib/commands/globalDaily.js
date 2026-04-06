// @flow
'use strict';
const got = require('got');
const ora = require('ora');
const chalk = require('chalk');
const { table } = require('../utils/cli');
const { getAllPackages } = require('../utils/dir');
const { getAllPackagesName } = require('../utils/getInternalDependency');

/*::
  type SpinnerType = {
    text: string,
    start: Function,
    succeed: Function,
    fail: Function,
  }
*/
function formatDate(date){
  return `${date.toISOString().split('T')[0]}`
}

async function getNpmStatsByDateRange(pkg, spinner, startDate, endDate) {
  startDate = formatDate(startDate);
  endDate = formatDate(endDate);
  try {
    const req = `https://api.npmjs.org/downloads/point/${startDate}:${endDate}/${pkg}`;
    const res = await got(req);
    spinner.succeed(chalk`Download complete for {green ${pkg} at ${startDate}} `);
    return JSON.parse(res.body);
  } catch(error) {
    spinner.fail(chalk`Download failed for {red ${pkg} at ${startDate}}  with {red ${error}}`);
    return {downloads: 0};
  }
}

async function custom({ cwd, parameters, jsonFlag } /*: {cwd: string}*/) {
  const spinner /*: SpinnerType*/ = ora({
    text: chalk`Getting packages to download stats for`
  }).start();
  const [ , dateStart, dateEnd ] = parameters;
  const packages = await getAllPackages(cwd);
  
  const pkgNames = await getAllPackagesName(cwd, packages);
  let pkgsStat/*: { [{ package: string, start: string, end: string, downloads: number }] }*/ = [];

  spinner.succeed(chalk`Found {green ${pkgNames.length}} packages`);

  let start = new Date (dateStart), end = new Date(dateEnd);

  for (; start <= end; start.setDate(start.getDate()+1)  ){
    for (const pkg of pkgNames) {
      spinner.start(chalk`Downloading npm data for {yellow ${pkg}}`);
      let endDate = new Date(start);
      endDate.setDate(endDate.getDate() + 1);
      const pkgStats /* {downloads: number} */ = await getNpmStatsByDateRange(pkg, spinner, start, endDate);
      if (!pkgsStat[pkg])pkgsStat[pkg] = {}
      pkgsStat.push({...pkgStats})
    }
  }

  let sortedArray = pkgsStat.sort((maybeEarly,maybeLater)=>{return (new Date(maybeLater.date)) > (new Date(maybeEarly.date)) })
  sortedArray = sortedArray.sort((nameLast,nameFirst)=>{return nameFirst.package < nameLast.package})
  
  if (jsonFlag)
    console.log(sortedArray);
  else 
    console.log(
      table({
        columns: ['', chalk`{yellow Package Name}`, chalk`{yellow Date}` ,chalk`{yellow Download}`],
        rows: sortedArray.map((pkgInfo, index) => [index+1, pkgInfo.package, pkgInfo.start ,pkgInfo.downloads])
      })
    );
}

module.exports = custom;
