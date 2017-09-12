'use strict';

const fs = require('fs');
const path = require('path');
const process = require('process');
const ignore = require('ignore');
const chalk = require('chalk');

const root = process.cwd();

const ignoreRules = fs
  .readFileSync(path.resolve(root, '.npmignore'), 'utf-8')
  .split(/\n/g)
  .filter(string => string !== '');
const ig = ignore().add(
  ignoreRules
    .concat([
      '.*.swp',
      '._*',
      '.DS_Store',
      '.git',
      '.hg',
      '.npmrc',
      '.lock-wscript',
      '.svn',
      '.wafpickle-*',
      'config.gypi',
      'CVS',
      'npm-debug.log',
      'node_modules',
      '.gitignore',
      '.npmignore',
      '!package.json',
      '!README',
      '!CHANGELOG',
      '!LICENSE',
      '!LICENCE'
    ])
    .map(rule => `**/${rule}`)
);

const getFileList = nowPath => fs.readdirSync(nowPath)
  .reduce((result, file) => {
    const childFilePath = path.resolve(nowPath, file);
    const stats = fs.lstatSync(childFilePath);

    if(stats.isDirectory())
      return result.concat(getFileList(childFilePath));
    else
      result.push(childFilePath.replace(root, '.'));

    return result;
  }, []);

const output = ig.filter(getFileList(root))
  .reduce((result, filePath) => {
    const newPath = path.extname(filePath) !== '' ?
      `${path.dirname(filePath)}/*${path.extname(filePath)}` :
      filePath;

    if(result[newPath])
      result[newPath].push(filePath);
    else
      result[newPath] = [filePath];

    return result;
  }, {});

module.exports = () => {
  Object.keys(output)
    .forEach(key => {
      if(output[key].length === 1)
        console.log(output[key][0]);
      else
        console.log(`${key} ${chalk.cyan(`(${output[key].length})`)}`);
    });
};
