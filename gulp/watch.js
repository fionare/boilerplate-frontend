'use strict';

const { watch: _watch } = require('gulp');
const { paths } = require('./conf');

const watch = done => {
  _watch([paths.html.all], require('./markups').default);
  _watch([paths.css.all], require('./styles'));
  _watch([paths.js.all], require('./scripts'));
  _watch([paths.json.data.files], require('./markups').default);
  done();
};

module.exports = watch;
