'use strict';

var process = require('process');
var commandLineArgs = require('command-line-args');
var watch = require('node-watch');
var ignore = require('ignore');

var _require = require('./utils/getFileList'),
    getFileListWithFilter = _require.getFileListWithFilter,
    getIngoreRules = _require.getIngoreRules;

var upload = require('./utils/upload');

module.exports = function (argv) {
  var _commandLineArgs = commandLineArgs([{
    name: 'host',
    alias: 'h',
    type: String,
    defaultValue: 'localhost'
  }, {
    name: 'port',
    alias: 'p',
    type: Number,
    defaultValue: 8000
  }, {
    name: 'ignore',
    alias: 'i',
    type: String,
    multiple: true,
    defaultValue: []
  }], {
    argv: argv
  }),
      host = _commandLineArgs.host,
      port = _commandLineArgs.port,
      addIgnore = _commandLineArgs.ignore;

  var ig = ignore().add(getIngoreRules('.gitignore', addIgnore));
  var files = getFileListWithFilter('.gitignore', addIgnore);

  upload(host, port, files);
  watch(process.cwd(), {
    recursive: true,
    filter: function filter(name) {
      return ig.filter(name).length !== 0;
    }
  }, function (evt, name) {
    if (evt === 'update') upload(host, port, [name]);
  });
};