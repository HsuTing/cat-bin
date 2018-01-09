'use strict';

var path = require('path');
var process = require('process');
var chalk = require('chalk');

var _require = require('./utils/getFileList'),
    getFileListWithFilter = _require.getFileListWithFilter;

var root = process.cwd();

var files = getFileListWithFilter('.npmignore').reduce(function (result, filePath) {
  var newPath = path.extname(filePath) !== '' ? path.dirname(filePath) + '/*' + path.extname(filePath) : filePath;

  if (result[newPath]) result[newPath].push(filePath);else result[newPath] = [filePath];

  return result;
}, {});

module.exports = function () {
  Object.keys(files).forEach(function (key) {
    if (files[key].length === 1) console.log(files[key][0].replace(root, '.'));else console.log(key.replace(root, '.') + ' ' + chalk.green('(' + files[key].length + ')'));
  });
};