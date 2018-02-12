'use strict';
const test = require('ava');
const fixtures = require('fixturez');
const {getAllPackages} = require('../../lib/utils/dir');
const f = fixtures(__dirname);

test('to get packages in bolt repo', async t => {
  let cwd = f.copy('bolt-repo');
  let h = await getAllPackages(cwd);
  t.regex(h.toString(), /elem/);
  t.regex(h.toString(), /research/);
  t.regex(h.toString(), /util/);
});

test('to get packages in lerna repo', async t => {
  let cwd = f.copy('lerna-repo');
  let h = await getAllPackages(cwd);
  t.regex(h.toString(), /elem/);
  t.regex(h.toString(), /research/);
  t.regex(h.toString(), /util/);
});

test('to get packages in generic repo', async t => {
  let cwd = f.copy('generic-repo');
  let h = await getAllPackages(cwd);
  t.regex(h.toString(), /elem/);
  t.regex(h.toString(), /research/);
  t.regex(h.toString(), /util/);
});
