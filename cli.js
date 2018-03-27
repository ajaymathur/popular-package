#!/usr/bin/env node
// @flow
"use strict";
const run = require('./dist/run');

run(process.argv.slice(2)).catch(err => {
  console.error(err);
  process.exit(1);
});
