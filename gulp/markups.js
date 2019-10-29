'use strict';

const { src, dest } = require('gulp');
const { paths } = require('./conf');

const $ = require('gulp-load-plugins')();

const markups = () => {
  const nunjucksOptions = { path: paths.html.import };
  const injectStyles = src(paths.css.static, { read: false });
  const injectScripts = src(paths.js.static, { read: false });
  const injectOptions = { ignorePath: paths.dist.dir, addRootSlash: false };
  const renameOptions = file => {
    if (file.basename == 'index') return;
    file.dirname = file.basename.split('_').join('/');
    file.basename = 'index';
  };

  return src(paths.html.entry)
    .pipe($.nunjucksRender(nunjucksOptions))
    .pipe($.rename(renameOptions))
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(dest(paths.dist.dir))
    .pipe($.touchCmd());
};

exports.markups = markups;
