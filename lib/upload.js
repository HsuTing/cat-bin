'use strict';

const fs = require('fs');
const path = require('path');
const process = require('process');
const commandLineArgs = require('command-line-args');

const upload = require('./utils/upload');
const {getFileList} = require('./utils/getFileList');

module.exports = argv => {
  const {host, port, file} = commandLineArgs([{
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
    argv
  });

  const filePath = path.resolve(process.cwd(), file);

  upload(host, port, (
    fs.lstatSync(filePath).isDirectory() ?
      getFileList(filePath) :
      [filePath]
  ));
};
