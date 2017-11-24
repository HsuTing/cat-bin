'use strict';

const fs = require('fs');
const path = require('path');
const ignore = require('ignore');

const getFileList = root => fs.readdirSync(root)
  .reduce((result, file) => {
    const childFilePath = path.resolve(root, file);

    if(fs.lstatSync(childFilePath).isDirectory())
      return result.concat(getFileList(childFilePath));
    else
      result.push(childFilePath);

    return result;
  }, []);

const getIngoreRules = (ignoreFileName, addIgnore = []) => {
  const ignorePath = path.resolve(process.cwd(), ignoreFileName);
  const ignoreRules = (
    fs.existsSync(ignorePath) ? (
      fs.readFileSync(ignorePath, 'utf-8')
        .split(/\n/g)
        .filter(string => string !== '')
    ) : []
  );

  return [
    ...ignoreRules,
    ...addIgnore,
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
  ].map(rule => `**/${rule}`);
};

exports.getIngoreRules = getIngoreRules;
exports.getFileList = getFileList;
exports.getFileListWithFilter = (ignoreFileName, addIgnore) => ignore().add(
  getIngoreRules(ignoreFileName, addIgnore)
).filter(
  getFileList(process.cwd())
);
