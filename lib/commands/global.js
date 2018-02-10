'use strict';
const got = require('got');
const { table } = require('../utils/cli');
const { getDirectories } = require('../utils/dir');

async function global({ pkgsDir, flags }) {
  const packages = await getDirectories(pkgsDir);
  const res = await got(
    `https://api.npmjs.org/downloads/point/last-day/${packages.join(',')}`
  );
  const pkgsStat = JSON.parse(res.body);

  let sortedKeys = Object.keys(pkgsStat).sort(
    (maybeSmall, maybeBig) =>
      pkgsStat[maybeBig].downloads - pkgsStat[maybeSmall].downloads
  );

  console.log(
    table({
      columns: ['Package Name', 'Download'],
      rows: sortedKeys.map(key => [key, pkgsStat[key].downloads])
    })
  );
}

module.exports = global;
