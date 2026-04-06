'use strict';
const { table } = require('../../lib/utils/cli');

test('table() returns a string', () => {
  const result = table({ columns: ['#', 'Name'], rows: [[1, 'foo']] });
  expect(typeof result).toBe('string');
});

test('table() contains column headers', () => {
  const result = table({ columns: ['#', 'Package Name', 'Downloads'], rows: [] });
  expect(result).toMatch(/Package Name/);
  expect(result).toMatch(/Downloads/);
});

test('table() contains row data', () => {
  const result = table({
    columns: ['#', 'Name'],
    rows: [[1, 'my-package'], [2, 'other-package']],
  });
  expect(result).toMatch(/my-package/);
  expect(result).toMatch(/other-package/);
});

test('table() handles empty rows', () => {
  const result = table({ columns: ['#', 'Name', 'Count'], rows: [] });
  expect(typeof result).toBe('string');
  expect(result).toMatch(/Name/);
});
