'use strict';

// Mock HTTP calls and mono-repo utilities — no network or filesystem needed
jest.mock('got');
jest.mock('ora', () =>
  jest.fn().mockImplementation(() => ({
    start: jest.fn().mockReturnThis(),
    succeed: jest.fn().mockReturnThis(),
    fail: jest.fn().mockReturnThis(),
    text: '',
  }))
);
jest.mock('../../lib/utils/dir');
jest.mock('../../lib/utils/getInternalDependency');

const got = require('got');
const { getAllPackages } = require('../../lib/utils/dir');
const { getAllPackagesName } = require('../../lib/utils/getInternalDependency');
const globalCmd = require('../../lib/commands/global');

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('global() completes without error when no packages found', async () => {
  getAllPackages.mockResolvedValue([]);
  getAllPackagesName.mockResolvedValue(new Set());

  await globalCmd({ cwd: '/mock/repo' });

  expect(console.log).toHaveBeenCalled();
  const output = console.log.mock.calls[0][0];
  expect(typeof output).toBe('string');
});

test('global() outputs table header columns', async () => {
  getAllPackages.mockResolvedValue(['packages/my-pkg']);
  getAllPackagesName.mockResolvedValue(new Set(['my-pkg']));
  got.mockResolvedValue({ body: JSON.stringify({ downloads: 100 }) });

  await globalCmd({ cwd: '/mock/repo' });

  expect(console.log).toHaveBeenCalled();
  const output = console.log.mock.calls[0][0];
  expect(output).toMatch(/Package Name/);
  expect(output).toMatch(/Download/);
});
