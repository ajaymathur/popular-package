'use strict';
const test = require('ava');
const fixtures = require('fixturez');
const {getAllPackagesName, getInternalDependency} = require('../../lib/utils/getInternalDependency');
const f = fixtures(__dirname);

test('getAllPackagesName()',  async t => {
  let cwd = f.copy('generic-repo');
  const allPackagesName = await getAllPackagesName(cwd, ['/packages/elem', '/packages/research', '/packages/util']);
  t.is(allPackagesName.size, 3);
  t.truthy(allPackagesName.has('elem'));
  t.truthy(allPackagesName.has('research'));
  t.truthy(allPackagesName.has('util'));
});

test('getInternalDependency()', async t => {
  let cwd = f.copy('generic-repo');
  const dependencyGraph = await getInternalDependency(cwd, ['/packages/elem', '/packages/research', '/packages/util']);
  t.deepEqual(dependencyGraph, { research: [ 'elem' ] })
});
