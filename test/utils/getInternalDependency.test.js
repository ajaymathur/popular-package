'use strict';

jest.mock('path-exists');
jest.mock('read-pkg');

const pathExists = require('path-exists');
const readPkg = require('read-pkg');
const { getAllPackagesName, getInternalDependency } = require('../../lib/utils/getInternalDependency');

// Simulated mono-repo:
//   packages/elem  → depends on react and util
//   packages/react → no dependencies
//   packages/util  → no dependencies
const MOCK_PKG_JSONS = {
  '/packages/elem': { name: 'elem', version: '0.0.0', dependencies: { react: '*', util: '*' } },
  '/packages/react': { name: 'react', version: '0.0.0' },
  '/packages/util': { name: 'util', version: '0.0.0' },
};

beforeEach(() => {
  pathExists.mockImplementation(p => Promise.resolve(p.endsWith('package.json')));
  readPkg.mockImplementation(p => {
    // p is the directory path passed to readPkg
    const key = Object.keys(MOCK_PKG_JSONS).find(k => p.endsWith(k));
    return key ? Promise.resolve(MOCK_PKG_JSONS[key]) : Promise.reject(new Error('not found'));
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

test('getAllPackagesName() returns a Set of all package names', async () => {
  const result = await getAllPackagesName('/mock', [
    '/packages/elem',
    '/packages/react',
    '/packages/util',
  ]);

  expect(result.size).toBe(3);
  expect(result.has('elem')).toBe(true);
  expect(result.has('react')).toBe(true);
  expect(result.has('util')).toBe(true);
});

test('getInternalDependency() builds correct dependency graph', async () => {
  const graph = await getInternalDependency('/mock', [
    '/packages/elem',
    '/packages/react',
    '/packages/util',
  ]);

  // elem depends on react and util, so both should list elem as a dependent
  expect(graph).toEqual({ react: ['elem'], util: ['elem'] });
});
