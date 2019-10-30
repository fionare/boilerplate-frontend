'use strict';

const { src, dest } = require('gulp');
const { paths } = require('./conf');

const $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'rollup{,-*}']
});

const scripts = () => {
  const production = process.env.NODE_ENV === 'production';

  const babelOptions = {
    presets: [['@babel/env']],
    exclude: 'node_modules/**'
  };

  const rollupPlugins = [
    $.rollupPluginBabel(babelOptions),
    $.rollupPluginNodeResolve(),
    $.rollupPluginCommonjs()
  ];

  production && rollupPlugins.push($.rollupPluginTerser.terser());

  const injectFiles = src(paths.js.import, { read: false });

  const injectOptions = {
    transform: path => {
      const filePath = path.substring(path.indexOf('/'), path.lastIndexOf('.'));
      const fileName = path.substring(
        path.lastIndexOf('/') + 1,
        path.lastIndexOf('.')
      );
      return `import ${fileName} from '../../${filePath}';`;
    },
    starttag: '// inject:imports',
    endtag: '// endinject'
  };

  return src(paths.js.entry)
    .pipe($.inject(injectFiles, injectOptions))
    .pipe(production ? $.rename('scripts.min.js') : $.noop())
    .pipe(dest(paths.dist.include))
    .pipe(!production ? $.sourcemaps.init() : $.noop())
    .pipe($.betterRollup({ plugins: rollupPlugins }, { format: 'iife' }))
    .pipe(!production ? $.sourcemaps.write('.') : $.noop())
    .pipe(dest(paths.dist.include))
    .pipe($.touchCmd());
};

module.exports = scripts;
