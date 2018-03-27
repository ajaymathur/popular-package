'use strict';

let getNpmStats = (() => {
  var _ref = _asyncToGenerator(function* (pkg, spinner) {
    try {
      const res = yield got(`https://api.npmjs.org/downloads/point/last-day/${pkg}`);
      spinner.succeed(chalk`Download complete for {green ${pkg}}`);
      return JSON.parse(res.body);
    } catch (error) {
      spinner.fail(chalk`Download failed for {red ${pkg}} with {red ${error}}`);
      return { downloads: 0 };
    }
  });

  return function getNpmStats(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

let global = (() => {
  var _ref2 = _asyncToGenerator(function* ({ cwd /*: {cwd: string}*/ }) {
    const spinner = ora({
      text: chalk`Getting packages to download stats for`
    }).start();
    const packages = yield getAllPackages(cwd);
    const pkgNames = yield getAllPackagesName(cwd, packages);
    let pkgsStat /*: { [key: string]: { downloads: number } }*/ = {};

    spinner.succeed(chalk`Found {green ${pkgNames.size}} packages`);

    for (var _iterator = pkgNames, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref3 = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref3 = _i.value;
      }

      const pkg = _ref3;

      spinner.start(chalk`Downloading npm data for {yellow ${pkg}}`);
      const pkgStats /* {downloads: number} */ = yield getNpmStats(pkg, spinner);
      pkgsStat[pkg] = pkgStats;
    }

    let sortedKeys = Object.keys(pkgsStat).sort(function (maybeSmall, maybeBig) {
      return pkgsStat[maybeBig].downloads - pkgsStat[maybeSmall].downloads;
    });

    console.log(table({
      columns: ['', chalk`{yellow Package Name}`, chalk`{yellow Download}`],
      rows: sortedKeys.map(function (key, index) {
        return [index + 1, key, pkgsStat[key].downloads];
      })
    }));
  });

  return function global(_x3) {
    return _ref2.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const got = require('got');
const ora = require('ora');
const chalk = require('chalk');

var _require = require('../utils/cli');

const table = _require.table;

var _require2 = require('../utils/dir');

const getAllPackages = _require2.getAllPackages;

var _require3 = require('../utils/getInternalDependency');

const getAllPackagesName = _require3.getAllPackagesName;


module.exports = global;