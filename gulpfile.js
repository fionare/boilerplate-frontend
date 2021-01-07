"use strict";

const runner = require("./gulp/default.js");

exports.default = runner.default;
exports.build = runner.build;
exports.install = require("./gulp/install.js").default;
exports.run = runner.run;
