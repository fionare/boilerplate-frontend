'use strict';

const production = process.env.NODE_ENV === 'production';

const paths = {
  modules: {
    jquery: 'node_modules/jquery/dist/jquery.min.js',
    photoswipe: [
      'node_modules/photoswipe/dist/default-skin/*',
      '!node_modules/photoswipe/dist/default-skin/*.css'
    ]
  },
  dist: {
    dir: 'dist',
    all: 'dist/**/*',
    assets: 'dist/assets',
    include: 'dist/includes',
    ignore: ['!dist/includes{,/jquery.min.js}', '!dist/assets']
  },
  html: {
    entry: 'src/index.html',
    import: ['src/pages', 'src/components'],
    all: 'src/**/*.html'
  },
  css: {
    entry: 'src/styles.scss',
    import: [
      'src/components/**/*.scss',
      '!src/**/_*.scss',
      '!src/base/styles.scss'
    ],
    all: 'src/**/*.scss',
    static: 'dist/**/*.css'
  },
  js: {
    entry: 'src/script.js',
    import: ['src/components/**/*.js', '!src/**/_*.js', '!src/base/index.js'],
    all: 'src/**/*.js',
    static: 'dist/**/*.js'
  }
};

module.exports = {
  production,
  paths
};
