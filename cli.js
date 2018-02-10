#!/usr/bin/env node
"use strict";
const meow = require("meow");
const path = require("path");
const {internal, global} = require('./');

async function cli(argv) {
  const cli = meow({
    argv,
    help: `
      popular package helps identify the popular package within a mono repo

      Usage

      $ popular-package <command>

      Commands

      internal      Get the internal (within monorepo) popularity of the packages
      global        Get the popularity of packages by number of downloads on npm

      Examples

      To get popularity of packages within mono repo
      $ popular-package internal

      To get popularityy of packages on npm
      $ popular-package global
    `
  });

  if (cli.input.length < 1) {
    cli.showHelp();
  }

  const command = cli.input[0];
  const cwd = process.cwd();
  const pkgsDir = path.join(cwd, "packages");

  if (command === 'internal') {
    await internal({
      flags: cli.flags,
      pkgsDir,
    });
  } else if (command === 'global') {
    await global({
      flags: cli.flags,
      pkgsDir,
    });
  } else {
    throw new Error(`Unknown command "${command}"`);
  }
}

cli(process.argv.slice(2)).catch(err => {
  console.error(err);
  process.exit(1);
});
