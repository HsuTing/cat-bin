'use strict';

import fs from 'fs';
import path from 'path';
import process from 'process';
import commandLineArgs from 'command-line-args';

import upload from './utils/upload';
import {getFileList} from './utils/getFileList';

export default argv => {
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
