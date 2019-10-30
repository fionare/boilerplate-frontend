'use strict';

const { src, dest } = require('gulp');
const { paths } = require('./conf');

const $ = require('gulp-load-plugins')();

const copy = done => {
  src(paths.modules.jquery)
    .pipe(dest(paths.dist.include))
    .pipe($.touchCmd());
  src(paths.modules.photoswipe)
    .pipe(dest(paths.dist.assets))
    .pipe($.touchCmd());
  done();
};

module.exports = copy;
