'use strict';

/*::
  type LernaConfigType = {
    packages: Array<string>,
    [Key: string]: mixed,
  }
*/

/*::
  type PackageJsonType = {
    name: string,
    dependencies: { [key: string]: string },
    [key: string]: string | { [key: string]: string },
  }
*/

let exists = (() => {
  var _ref = _asyncToGenerator(function* (filePath /*: string*/) {
    try {
      yield stat(filePath);
      return true;
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }
    return false;
  });

  return function exists(_x) {
    return _ref.apply(this, arguments);
  };
})();

let getAllPackages = (() => {
  var _ref2 = _asyncToGenerator(function* (cwd /*: string */) {
    const isLernaProject /*: boolean */ = yield exists(path.join(cwd, 'lerna.json'));
    let defaultPkgsDirPattern /*: Array<string>*/ = ['packages/*'];
    let projectDirsPattern = defaultPkgsDirPattern;

    if (isLernaProject) {
      const lernaConfig = yield readFile(path.join(cwd, 'lerna.json'));
      const lernaJson /*: LernaConfigType */ = JSON.parse(lernaConfig);
      projectDirsPattern = lernaJson.packages || defaultPkgsDirPattern;
    } else {
      const pkgJSON /*: PackageJsonType*/ = yield readPkg(path.join(cwd, 'package.json'));
      projectDirsPattern = pkgJSON.bolt && pkgJSON.bolt.workspaces || defaultPkgsDirPattern;
    }

    const projectPkgs /*: Array<string> */ = yield globby(projectDirsPattern, { cwd, nodir: false, gitignore: true });

    return projectPkgs;
  });

  return function getAllPackages(_x2) {
    return _ref2.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const fs = require('fs');
const path = require('path');
const readPkg = require('read-pkg');
const globby = require('globby');

var _require = require('util');

const promisify = _require.promisify;


const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

module.exports = {
  getAllPackages
};