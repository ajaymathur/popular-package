'use strict';

// Mock fs before dir.js loads so promisify() captures our jest.fn()s
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  stat: jest.fn(),
  readFile: jest.fn(),
}));
jest.mock('globby');
jest.mock('read-pkg');

const fs = require('fs');
const globby = require('globby');
const readPkg = require('read-pkg');
const { getAllPackages } = require('../../lib/utils/dir');

// Helper: make fs.stat reject with ENOENT (simulate missing file)
function statMissing() {
  fs.stat.mockImplementation((p, cb) =>
    cb(Object.assign(new Error('ENOENT'), { code: 'ENOENT' }))
  );
}

// Helper: make fs.stat succeed (simulate file exists)
function statExists() {
  fs.stat.mockImplementation((p, cb) => cb(null, {}));
}

afterEach(() => {
  jest.clearAllMocks();
});

test('getAllPackages() for bolt repo uses bolt workspaces', async () => {
  statMissing(); // no lerna.json
  readPkg.mockResolvedValue({ name: 'bolt-repo', bolt: { workspaces: ['packages/*'] } });
  globby.mockResolvedValue(['packages/elem', 'packages/react', 'packages/util']);

  const result = await getAllPackages('/mock/bolt-repo');

  expect(result.toString()).toMatch(/elem/);
  expect(result.toString()).toMatch(/react/);
  expect(result.toString()).toMatch(/util/);
});

test('getAllPackages() for lerna repo uses lerna.json packages field', async () => {
  statExists(); // lerna.json exists
  fs.readFile.mockImplementation((p, cb) =>
    cb(null, Buffer.from(JSON.stringify({ version: '1.1.3', packages: ['packages/*'] })))
  );
  globby.mockResolvedValue(['packages/elem', 'packages/react', 'packages/util']);

  const result = await getAllPackages('/mock/lerna-repo');

  expect(result.toString()).toMatch(/elem/);
  expect(result.toString()).toMatch(/react/);
  expect(result.toString()).toMatch(/util/);
});

test('getAllPackages() for generic repo defaults to packages/*', async () => {
  statMissing(); // no lerna.json
  readPkg.mockResolvedValue({ name: 'generic-repo' }); // no bolt workspaces
  globby.mockResolvedValue(['packages/elem', 'packages/react', 'packages/util']);

  const result = await getAllPackages('/mock/generic-repo');

  expect(result.toString()).toMatch(/elem/);
  expect(result.toString()).toMatch(/react/);
  expect(result.toString()).toMatch(/util/);
});
