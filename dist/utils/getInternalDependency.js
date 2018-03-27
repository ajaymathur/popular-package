'use strict';

/*::
  type PackageJsonType = {
    name: string,
    dependencies: { [key: string]: string },
    [key: string]: string | { [key: string]: string },
  }
*/

let getAllPackagesName = (() => {
  var _ref = _asyncToGenerator(function* (cwd /*: string */, pkgPath /*: Array<string> */) {
    const packages = new Set();
    for (var _iterator = pkgPath, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref2 = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref2 = _i.value;
      }

      const pkg = _ref2;

      const doesPathExit /*: boolean */ = yield pathExists(path.join(cwd, pkg, 'package.json'));
      if (doesPathExit) {
        const pkgJson /*: PackageJsonType */ = yield readPkg(path.join(cwd, pkg));
        if (!pkgJson.private) {
          packages.add(pkgJson.name);
        }
      }
    }
    return packages;
  });

  return function getAllPackagesName(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

let getInternalDependency = (() => {
  var _ref3 = _asyncToGenerator(function* (cwd /*: string */, packages /*: Array<string> */) {
    let dependentGraph /*: { [key: string]: Array<string> }*/ = {};
    const allPackages = yield getAllPackagesName(cwd, packages);

    for (var _iterator2 = packages, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref4;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref4 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref4 = _i2.value;
      }

      const pkg = _ref4;

      const pathExit /*: boolean*/ = yield pathExists(path.join(cwd, pkg, 'package.json'));

      if (pathExit) {
        const pkgJson /*: PackageJsonType */ = yield readPkg(path.join(cwd, pkg));

        if (pkgJson.dependencies) {
          Object.keys(pkgJson.dependencies).map(function (dependency) {
            if (allPackages.has(dependency)) {
              dependentGraph[dependency] ? dependentGraph[dependency].push(pkgJson.name) : dependentGraph[dependency] = [pkgJson.name];
            }
          });
        }
      }
    }

    return dependentGraph;
  });

  return function getInternalDependency(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const path = require('path');
const readPkg = require('read-pkg');
const fileExists = require('file-exists');
const pathExists = require('path-exists');

module.exports = {
  getAllPackagesName,
  getInternalDependency
};