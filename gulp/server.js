'use strict';

const browserSync = require('browser-sync').create();
const { paths } = require('./conf');

const server = () => {
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

exports.server = server;
