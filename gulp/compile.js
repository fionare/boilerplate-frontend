'use strict';

const { series, parallel } = require('gulp');

const compile = series(
  require('./clean'),
  parallel(require('./copy'), require('./styles'), require('./scripts')),
  require('./markups')
);

module.exports = compile;
