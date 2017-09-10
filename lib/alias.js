'use strict';

const fs = require('fs');
const path = require('path');
const process = require('process');

module.exports = args => {
  const {plugins} = JSON.parse(fs.readFileSync(
    path.resolve(process.cwd(), './.babelrc')
  ));
  const alias = plugins.slice(-1)[0][1].alias;

  switch(args[0]) {
    case '--keys':
      console.log(Object.keys(alias));
      break;

    case '--values':
      console.log(Object.values(alias));
      break;

    default:
      console.log(alias);
      break;
  }
};
