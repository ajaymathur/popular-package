'use strict';

// Mock the mono-repo utilities so no real filesystem is needed
jest.mock('../../lib/utils/dir');
jest.mock('../../lib/utils/getInternalDependency');

// Mock ora spinner to be a no-op
jest.mock('ora', () =>
  jest.fn().mockImplementation(() => ({
    start: jest.fn().mockReturnThis(),
    succeed: jest.fn().mockReturnThis(),
    fail: jest.fn().mockReturnThis(),
  }))
);

const { getAllPackages } = require('../../lib/utils/dir');
const { getInternalDependency } = require('../../lib/utils/getInternalDependency');
const internal = require('../../lib/commands/internal');

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('internal() outputs dependency table for generic repo', async () => {
  // Simulate a generic mono-repo with react and elem packages where react is a dep of elem
  getAllPackages.mockResolvedValue(['packages/react', 'packages/elem']);
  getInternalDependency.mockResolvedValue({
    react: ['elem'],
  });

  await internal({ cwd: '/mock/generic-repo' });

  expect(console.log).toHaveBeenCalled();
  const output = console.log.mock.calls[0][0];
  expect(output).toMatch(/react/);
  expect(output).toMatch(/elem/);
});

test('internal() outputs table headers for lerna repo', async () => {
  getAllPackages.mockResolvedValue(['packages/elem', 'packages/util']);
  getInternalDependency.mockResolvedValue({
    util: ['elem'],
  });

  await internal({ cwd: '/mock/lerna-repo' });

  expect(console.log).toHaveBeenCalled();
  const output = console.log.mock.calls[0][0];
  expect(output).toMatch(/Package Name/);
  expect(output).toMatch(/Dependent Packages/);
});

test('internal() outputs table headers for bolt repo', async () => {
  getAllPackages.mockResolvedValue(['packages/elem', 'packages/util']);
  getInternalDependency.mockResolvedValue({
    util: ['elem'],
  });

  await internal({ cwd: '/mock/bolt-repo' });

  expect(console.log).toHaveBeenCalled();
  const output = console.log.mock.calls[0][0];
  expect(output).toMatch(/Package Name/);
  expect(output).toMatch(/Dependent Packages/);
});
