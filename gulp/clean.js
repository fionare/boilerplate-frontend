'use strict';

const { paths } = require('./conf');

const clean = () => require('del')([paths.dist.all, ...paths.dist.ignore]);

module.exports = clean;
