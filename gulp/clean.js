'use strict';

const { paths } = require('./conf');

const clean = () =>
  require('del')([
    paths.dist.all,
    paths.json.tmp.dir,
    ...paths.dist.ignore
  ]);

module.exports = clean;
