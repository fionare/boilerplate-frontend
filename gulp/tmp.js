'use strict';

const fs = require('fs-extra');
const path = require('path');
const { paths } = require('./conf');

const tmp = done => {
  fs.ensureDirSync(paths.json.tmp.dir);
  try {
    const content = fs.readFileSync(paths.json.tmp.file, {"encoding": "utf8"});
    if(content && content !== "") {
      JSON.parse(content).forEach(file => {
        fs.copyFileSync(
          path.join('src/', file.layout),
          path.join(paths.json.tmp.dir, `${file.path}.html`)
          );

        fs.writeJsonSync(
          path.join(paths.json.tmp.dir, `${file.path}.json`),
          file.data
          );
      });
    }
  } catch(err) {
    throw err;
  }

  done();
};

module.exports = tmp;
