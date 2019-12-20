'use strict';

const { src, dest } = require('gulp');
const { paths } = require('./conf');

const $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'auto*', '*css*']
});

$.sass.compiler = require('node-sass');

const styles = () => {
  const production = process.env.NODE_ENV === 'production';

  const sassOptions = {
    outputStyle: 'expanded',
    includePaths: 'node_modules'
  };

  const prefixerOptions = {
    overrideBrowserslist: [
      'last 1 major version',
      '>= 1%',
      'Chrome >= 45',
      'Firefox >= 38',
      'Edge >= 12',
      'Explorer >= 10',
      'iOS >= 9',
      'Safari >= 9',
      'Android >= 4.4',
      'Opera >= 30'
    ]
  };

  const postcssOptions = [
    $.autoprefixer(prefixerOptions),
    $.postcssSortMediaQueries()
  ];

  production && postcssOptions.push($.cssnano());

  const injectFiles = src(paths.css.import, { read: false });

  const injectOptions = {
    transform: filePath => `@import '${filePath}';`,
    starttag: '// inject:imports',
    endtag: '// endinject',
    addRootSlash: false,
    quiet: true
  };

  return src(paths.css.entry)
    .pipe($.inject(injectFiles, injectOptions))
    .pipe(!production ? $.sourcemaps.init() : $.noop())
    .pipe($.sass(sassOptions).on('error', $.sass.logError))
    .pipe($.postcss(postcssOptions))
    .pipe(!production ? $.sourcemaps.write('.') : $.noop())
    .pipe(production ? $.rename('styles.min.css') : $.noop())
    .pipe(dest(paths.dist.include))
    .pipe($.touchCmd());
};

module.exports = styles;
