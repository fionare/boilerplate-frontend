'use strict';

const browserSync = require('browser-sync').create();
const { paths } = require('./conf');

const serve = () => {
  browserSync.init({
    server: {
      baseDir: paths.dist.dir
    },
    notify: false,
    open: false,
    online: true
  });

  browserSync.watch(paths.dist.all).on('change', browserSync.reload);
};

module.exports = serve;
