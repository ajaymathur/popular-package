#!/usr/bin/env node
// @flow
"use strict";
const meow = require("meow");
const chalk = require("chalk");
const {internal, global, globalDaily} = require('./');

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

async function cli(argv /*: Array<string>*/) {
  const cli /*: CliType*/ = meow({
    argv,
    help: `
      popular package helps identify the popular package within a mono repo

      Usage

      $ popular-package <command> [options]

      Commands

      internal      Get the internal (within monorepo) popularity of the packages
      global        Get the popularity of packages by number of downloads on npm
      global daily  <start date>  <end date> Get daily downloads of packages by number of downloads on npm. Dates in YYYY-MM-DD.

      Examples

      View internal popularity of a package in bolt or lerna repo:

      $ popular-package internal


      View popularity of packages on npm for a bolt or lerna repo:

      $ popular-package global

      View daily downloads packages on npm for a bolt or lerna repo:

      $ popular-package global daily 2018-01-01 2018-01-31
    `
  });

  if (cli.input.length < 1) {
    cli.showHelp();
  }

  const input = cli.input;
  const command = input.shift();
  const parameters = input;
  const jsonFlag = !!cli.flags.json;

  const cwd = cli.flags.cwd || process.cwd();

  if (command === 'internal') {
    await internal({
      cwd, jsonFlag
    });
  } else if (command === 'global') {
    
    if (parameters){
      await globalDaily({
        cwd, parameters, jsonFlag
      });
    }else{
      await global({
        cwd, jsonFlag
      });
    }
  } else {
    throw new Error(chalk`Unknown command {red "${command}"}. Supported commands are {green "internal"} and {green "global"}`);
  }
}

cli(process.argv.slice(2)).catch(err => {
  console.error(err);
  process.exit(1);
});
