'use strict';

import process from 'process';
import commandLineArgs from 'command-line-args';
import watch from 'node-watch';
import ignore from 'ignore';

import {getFileListWithFilter, getIngoreRules} from './utils/getFileList';
import upload from './utils/upload';

export default argv => {
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
  const files = getFileListWithFilter('.gitignore', addIgnore);

  upload(host, port, files);
  watch(process.cwd(), {
    recursive: true,
    filter: name => ig.filter(name).length !== 0
  }, (evt, name) => {
    if(evt === 'update')
      upload(host, port, [name]);
  });
};
