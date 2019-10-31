'use strict';

const browserSync = require('browser-sync').create();
const { paths } = require('./conf');
const markups = require("./markups");

const serve = () => {
  browserSync.init({
    server: {
      baseDir: paths.dist.dir
    },
    notify: false,
    open: false,
    online: true
  }, function() {
    let basePath = browserSync.getOption('urls').get('external');
    markups.setBasePath(basePath + "/");
    markups.default();
  });

  browserSync.watch(paths.dist.all).on('change', browserSync.reload);
};

module.exports = serve;
