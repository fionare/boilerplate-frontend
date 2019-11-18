'use strict';

const fs = require('fs-extra');
const { paths } = require('./conf');

const bump = done => {
  // load file
  let project = JSON.parse(fs.readFileSync(paths.json.config)).themeinfo;

  // check file modified time
  let stat = fs.statSync(paths.json.config);

  // build version
  let version = Math.round(
    (new Date().getTime() - parseInt(stat.mtimeMs)) / 1000
  )
    .toString(16)
    .toUpperCase();

  // build style.css
  let stylestring = '/*\n';
  stylestring += 'Theme Name: ' + project.name + '\n';
  stylestring += 'Description: ' + project.description + '\n';
  stylestring += 'Author: ' + project.author + '\n';
  stylestring += 'Author URI: ' + project.uri + '\n';
  stylestring += 'Version: ' + version + '\n';
  stylestring += '*/\n';
  fs.writeFileSync('style.css', stylestring);

  done();
};

module.exports = bump;
