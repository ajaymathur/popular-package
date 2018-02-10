'use strict';
const Table = require('cli-table');

function table({ columns, rows }) {
  let table = new Table({ head: columns });
  table.push(...rows);
  return table.toString();
}

module.exports = {
  table
}
