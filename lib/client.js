'use strict';

const fs = require('fs');
const path = require('path');
const process = require('process');
const commandLineArgs = require('command-line-args');
const FormData = require('form-data');
const watch = require('node-watch');
const ignore = require('ignore');

const getFileList = require('./utils/getFileList').default;
const {getIngoreRules} = require('./utils/getFileList');

const upload = (host, port, filesData) => {
  const form = new FormData();
  const filePathArray = [];
  const files = filesData.filter(file => fs.lstatSync(file).isFile());

  if(files.length === 0)
    return;

  files.forEach(file => {
    const filePath = file.replace(process.cwd(), '.');

    form.append('upload', fs.createReadStream(file));
    filePathArray.push(path.dirname(file).replace(process.cwd(), '.'));
    console.log('upload %s', filePath);
  });
  form.append('filePaths', JSON.stringify(filePathArray));
  form.submit({
    host,
    path: '/',
    port
  }, (err, res) => {
    if(err)
      throw new Error(err);

    res.resume();
  });
};

module.exports = argv => {
  const {host, port} = commandLineArgs([{
    name: 'host',
    alias: 'h',
    type: String,
    defaultValue: 'localhost'
  }, {
    name: 'port',
    alias: 'p',
    type: Number,
    defaultValue: 8000
  }], {
    argv
  });

  const ig = ignore().add(getIngoreRules('.gitignore'));
  const files = getFileList('.gitignore');

  upload(host, port, files);
  watch(process.cwd(), {
    recursive: true,
    filter: name => ig.filter(name).length !== 0
  }, (evt, name) => {
    if(evt === 'update')
      upload(host, port, [name]);
  });
};
