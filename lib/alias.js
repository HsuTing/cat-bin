'use strict';

const fs = require('fs');
const path = require('path');
const process = require('process');

module.exports = () => {
  const {plugins} = JSON.parse(fs.readFileSync(
    path.resolve(process.cwd(), './.babelrc')
  ));
  const alias = plugins.slice(-1)[0][1].alias;

  console.log(alias);
};
