#!/usr/bin/env node
"use strict";
const meow = require("meow");
const {internal, global} = require('./');

async function cli(argv) {
  const cli = meow({
    argv,
    help: `
      popular package helps identify the popular package within a mono repo

      Usage

      $ popular-package <command> [options]

      Commands

      internal      Get the internal (within monorepo) popularity of the packages
      global        Get the popularity of packages by number of downloads on npm

      Examples

      View internal popularity of a package in bolt repo:

      $ popular-package internal --bolt


      View internal popularity of a packages for a lerna repo:

      $ popular-package internal --lerna


      View popularity of packages on npm for a bolt repo:

      $ popular-package global --bolt


      View popularity of packages on npm for a lerna repo:

      $ popular-package global --lerna
    `
  });

  if (cli.input.length < 1) {
    cli.showHelp();
  }

  const command = cli.input[0];
  const cwd = cli.flags.cwd || process.cwd();

  if (command === 'internal') {
    await internal({
      cwd,
      flags: cli.flags,
    });
  } else if (command === 'global') {
    await global({
      cwd,
      flags: cli.flags,
    });
  } else {
    throw new Error(`Unknown command "${command}"`);
  }
}

cli(process.argv.slice(2)).catch(err => {
  console.error(err);
  process.exit(1);
});
