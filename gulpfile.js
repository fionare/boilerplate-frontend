'use strict';

const { series, parallel } = require('gulp');
const { compile, watch, serve, bump } = require('./gulp');

process.argv.indexOf('-c') > 0 && (process.env.NODE_ENV = 'production');
exports.default = series(compile, watch, serve);
exports.build = series(compile, bump);
