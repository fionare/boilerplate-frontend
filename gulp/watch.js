'use strict';

const { series, watch: _watch } = require('gulp');
const { paths } = require('./conf');
const tmp = require('./tmp');
const markups = require('./markups').default;

const watch = done => {
  _watch([paths.html.all], markups);
  _watch([paths.css.all], require('./styles'));
  _watch([paths.js.all], require('./scripts'));
  _watch([paths.json.data.files], markups);
  _watch([paths.json.tmp.file], tmp);
  _watch([paths.json.tmp.templates], tmp);
  done();
};

module.exports = watch;
