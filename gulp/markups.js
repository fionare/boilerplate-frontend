'use strict';

const { src, dest } = require('gulp');
const { paths } = require('./conf');

const $ = require('gulp-load-plugins')();

const markups = () => {
  const production = process.env.NODE_ENV === 'production';

  const nunjucksOptions = { path: paths.html.import };
  const injectStyles = src(paths.css.static, { read: false });
  const injectScripts = src(paths.js.static, { read: false });
  const injectOptions = { ignorePath: paths.dist.dir, addRootSlash: false };

  const renameOptions = file => {
    if (file.basename == 'index') return;
    file.dirname = file.basename.split('_').join('/');
    file.basename = 'index';
  };

  const prettyOptions = {
    indent_size: 2,
    max_preserve_newlines: 0
  };

  const fetchData = {
    basePath: 'http://localhost:3000/'
  };

  production && (injectOptions.removeTags = true);

  return src(paths.html.entry)
    .pipe($.data(fetchData))
    .pipe($.nunjucksRender(nunjucksOptions))
    .pipe($.rename(renameOptions))
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(production ? $.prettyHtml(prettyOptions) : $.noop())
    .pipe(dest(paths.dist.dir))
    .pipe($.touchCmd());
};

module.exports = markups;
