'use strict';

const { watch } = require('gulp');
const { paths } = require('./conf');
const { markups } = require('./markups');
const { styles } = require('./styles');
const { scripts } = require('./scripts');

const serveWatch = done => {
  watch([paths.html.all], markups);
  watch([paths.css.all], styles);
  watch([paths.js.all], scripts);
  done();
};

exports.watch = serveWatch;
