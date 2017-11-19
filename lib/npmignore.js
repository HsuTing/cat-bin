'use strict';

const path = require('path');
const process = require('process');
const chalk = require('chalk');

const getFileList = require('./utils/getFileList');

const root = process.cwd();

const files = getFileList('.npmignore')
  .reduce((result, filePath) => {
    const newPath = (
      path.extname(filePath) !== '' ?
        `${path.dirname(filePath)}/*${path.extname(filePath)}` :
        filePath
    );

    if(result[newPath])
      result[newPath].push(filePath);
    else
      result[newPath] = [filePath];

    return result;
  }, {});

module.exports = () => {
  Object.keys(files)
    .forEach(key => {
      if(files[key].length === 1)
        console.log(files[key][0].replace(root, '.'));
      else
        console.log(`${key.replace(root, '.')} ${chalk.green(`(${files[key].length})`)}`);
    });
};
