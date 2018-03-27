'use strict';

/*::
  type FlagsType = {
    cwd?: string
  }
 */
/*::
  type CliType = {
    input: Array<string>,
    flags: FlagsType,
    showHelp: Function,
  }
*/

let run = (() => {
  var _ref = _asyncToGenerator(function* (argv /*: Array<string>*/) {
    const cli /*: CliType*/ = meow({
      argv,
      help: `
      popular package helps identify the popular package within a mono repo

      Usage

      $ popular-package <command> [options]

      Commands

      internal      Get the internal (within monorepo) popularity of the packages
      global        Get the popularity of packages by number of downloads on npm

      Examples

      View internal popularity of a package in bolt or lerna repo:

      $ popular-package internal


      View popularity of packages on npm for a bolt or lerna repo:

      $ popular-package global
    `
    });

    if (cli.input.length < 1) {
      cli.showHelp();
    }

    const command = cli.input[0];
    const cwd = cli.flags.cwd || process.cwd();

    if (command === 'internal') {
      yield internal({
        cwd
      });
    } else if (command === 'global') {
      yield global({
        cwd
      });
    } else {
      throw new Error(chalk`Unknown command {red "${command}"}. Supported commands are {green "internal"} and {green "global"}`);
    }
  });

  return function run(_x) {
    return _ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const meow = require("meow");
const chalk = require("chalk");

var _require = require('../');

const internal = _require.internal,
      global = _require.global;


module.exports = run;