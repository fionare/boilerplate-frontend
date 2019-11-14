'use strict';

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
    ignore: ['!dist/includes{,/jquery.min.js}', '!dist/assets', '!dist/images']
  },
  html: {
    entry: ['src/pages/*.html', 'src/pages/tmp/*.html'],
    import: ['src/', 'src/includes', 'src/components'],
    all: 'src/**/*.html'
  },
  css: {
    entry: 'src/styles.scss',
    import: [
      'src/includes/**/*.scss',
      'src/components/**/*.scss',
      '!src/**/_*.scss',
      '!src/styles.scss'
    ],
    all: 'src/**/*.scss',
    static: 'dist/**/*.css'
  },
  js: {
    entry: 'src/script.js',
    import: [
      'src/includes/**/*.js',
      'src/components/**/*.js',
      '!src/**/_*.js',
      '!src/scripts.js'
    ],
    all: 'src/**/*.js',
    static: 'dist/**/*.js'
  },
  json: {
    data: {
      dir: 'src/data',
      files: 'src/data/*.json'
    },
    tmp: {
      dir: 'src/pages/tmp/',
      file: 'src/pages.json',
      templates: 'src/*.njk'
    },
    config: 'config.json'
  }
};

module.exports = { paths };
