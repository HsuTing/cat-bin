#!/usr/bin/env node
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
    .map(rule => `./${rule}`)
);

const getFileList = now_path => fs.readdirSync(now_path)
  .reduce((result, file) => {
    const childFilePath = path.resolve(now_path, file);
    const stats = fs.lstatSync(childFilePath);

    if(stats.isDirectory())
      return result.concat(getFileList(childFilePath));
    else
      result.push(childFilePath.replace(root, '.'));

    return result;
  }, []);

const output = ig.filter(getFileList(root))
  .reduce((result, file_path) => {
    const new_path = path.extname(file_path) !== '' ?
      `${path.dirname(file_path)}/*${path.extname(file_path)}` :
      file_path;

    if(result[new_path])
      result[new_path].push(file_path);
    else
      result[new_path] = [file_path];

    return result;
  }, {});

Object.keys(output)
  .forEach(key => {
    if(output[key].length === 1)
      console.log(output[key][0]);
    else
      console.log(`${key} ${chalk.cyan(`(${output[key].length})`)}`);
  });
