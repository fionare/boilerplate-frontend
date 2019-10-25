'use strict';

process.argv.indexOf('-w') < 0 && (process.env.NODE_ENV = 'production');

const fs = require('fs-extra');
const path = require('path');
const { series, parallel } = require('gulp');

const absFilePath = path.resolve('./gulp');

let $ = {};

try {
  fs.readdirSync(absFilePath)
    .filter(files => /\.(js)$/.test(files))
    .map(filteredFiles => require(`${absFilePath}/${filteredFiles}`))
    .forEach(exports => ($ = { ...$, ...exports }));
} catch (err) {
  throw err;
}

const tasks = [$.clean, parallel($.copy, $.styles, $.scripts), $.markups];

!$.production && tasks.push($.watch, $.server);
$.production && tasks.push($.themeinfo);

exports.default = series(...tasks);
