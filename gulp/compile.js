'use strict';

const { series, parallel } = require('gulp');
const markups = require('./markups');

module.exports.setBranch = branch => {
	markups.setBranch(branch);
};
module.exports.run = series(
	require('./clean'),
	parallel(require('./copy'), require('./styles'), require('./scripts')),  
	markups.default
);
