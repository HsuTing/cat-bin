'use strict';

const path = require('path');
const process = require('process');
const commandLineArgs = require('command-line-args');

const upload = require('./utils/upload');

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

  upload(host, port, [
    path.resolve(process.cwd(), file)
  ]);
};
