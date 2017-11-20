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

  const uploadFiles = files.splice(0, 1);

  uploadFiles.forEach(file => {
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
    upload(host, port, files);
  });
};

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
