'use strict';

let internal = (() => {
  var _ref = _asyncToGenerator(function* ({ cwd /*: {cwd: string}*/ }) {
    const spinner = new ora({
      text: 'Calculating internal dependency Data'
    }).start();
    const packages = yield getAllPackages(cwd);
    const dependencyTree = yield getInternalDependency(cwd, packages);

    let sortedKeys = Object.keys(dependencyTree).sort(function (maybeSmall, maybeBig) {
      return dependencyTree[maybeBig].length - dependencyTree[maybeSmall].length;
    });

    spinner.succeed('Completed with calculation for internal dependency');

    console.log(table({
      columns: ['', chalk`{yellow Package Name}`, chalk`{yellow Dependent Packages Count}`, chalk`{yellow Dependent Packages}`],
      rows: sortedKeys.map(function (key, index) {
        const extraPackages = Math.max(dependencyTree[key].length - 3, 0);
        const dependentPackagesExtraMessage = `and ${extraPackages} more.`;
        return [index + 1, key, dependencyTree[key].length, chalk`${dependencyTree[key].slice(0, 3)} {green ${extraPackages > 0 ? dependentPackagesExtraMessage : ''}}`];
      })
    }));
  });

  return function internal(_x) {
    return _ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const ora = require('ora');
const chalk = require('chalk');

var _require = require('../utils/cli');

const table = _require.table;

var _require2 = require('../utils/getInternalDependency');

const getInternalDependency = _require2.getInternalDependency;

var _require3 = require('../utils/dir');

const getAllPackages = _require3.getAllPackages;


module.exports = internal;