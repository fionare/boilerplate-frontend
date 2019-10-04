'use strict';

const del = require('del');
const { paths } = require('./conf');

const clean = () => del([paths.dist.all, ...paths.dist.ignore]);

exports.clean = clean;
