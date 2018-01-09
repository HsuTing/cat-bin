'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var fs = require('fs');
var path = require('path');
var ignore = require('ignore');

var getFileList = function getFileList(root) {
  return fs.readdirSync(root).reduce(function (result, file) {
    var childFilePath = path.resolve(root, file);

    if (fs.lstatSync(childFilePath).isDirectory()) return result.concat(getFileList(childFilePath));else result.push(childFilePath);

    return result;
  }, []);
};

var getIngoreRules = function getIngoreRules(ignoreFileName) {
  var addIgnore = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  var ignorePath = path.resolve(process.cwd(), ignoreFileName);
  var ignoreRules = fs.existsSync(ignorePath) ? fs.readFileSync(ignorePath, 'utf-8').split(/\n/g).filter(function (string) {
    return string !== '';
  }) : [];

  return [].concat(_toConsumableArray(ignoreRules), _toConsumableArray(addIgnore), ['.*.swp', '._*', '.DS_Store', '.git', '.hg', '.npmrc', '.lock-wscript', '.svn', '.wafpickle-*', 'config.gypi', 'CVS', 'npm-debug.log', 'node_modules', '.gitignore', '.npmignore', '!package.json', '!README', '!CHANGELOG', '!LICENSE', '!LICENCE']).map(function (rule) {
    return '**/' + rule;
  });
};

exports.getIngoreRules = getIngoreRules;
exports.getFileList = getFileList;
exports.getFileListWithFilter = function (ignoreFileName, addIgnore) {
  return ignore().add(getIngoreRules(ignoreFileName, addIgnore)).filter(getFileList(process.cwd()));
};