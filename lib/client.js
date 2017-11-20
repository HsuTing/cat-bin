'use strict';

const process = require('process');
const commandLineArgs = require('command-line-args');
const watch = require('node-watch');
const ignore = require('ignore');

const getFileList = require('./utils/getFileList').default;
const {getIngoreRules} = require('./utils/getFileList');
const upload = require('./utils/upload');

module.exports = argv => {
  const {host, port, ignore: addIgnore} = commandLineArgs([{
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
    argv
  });

  const ig = ignore().add(getIngoreRules('.gitignore', addIgnore));
  const files = getFileList('.gitignore', addIgnore);

  upload(host, port, files);
  watch(process.cwd(), {
    recursive: true,
    filter: name => ig.filter(name).length !== 0
  }, (evt, name) => {
    if(evt === 'update')
      upload(host, port, [name]);
  });
};
