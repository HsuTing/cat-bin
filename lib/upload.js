'use strict';

var fs = require('fs');
var path = require('path');
var process = require('process');
var commandLineArgs = require('command-line-args');

var upload = require('./utils/upload');

var _require = require('./utils/getFileList'),
    getFileList = _require.getFileList;

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
    name: 'file',
    alias: 'f',
    type: String,
    defaultOption: true
  }], {
    argv: argv
  }),
      host = _commandLineArgs.host,
      port = _commandLineArgs.port,
      file = _commandLineArgs.file;

  var filePath = path.resolve(process.cwd(), file);

  upload(host, port, fs.lstatSync(filePath).isDirectory() ? getFileList(filePath) : [filePath]);
};