// @flow
'use strict';

import fs from 'fs';
import path from 'path';
import commandLineArgs from 'command-line-args';

import upload from 'utils/upload';
import {getFileList} from 'utils/getFileList';

export default async (
  argv: Array<string>
): Promise<void> => {
  const {
    host,
    port,
    file
  }: {
    host: string,
    port: number,
    file: string
  } = commandLineArgs([{
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

  const filePath: string = path.resolve(process.cwd(), file);

  await upload(host, port, (
    fs.lstatSync(filePath).isDirectory() ?
      getFileList(filePath) :
      [filePath]
  ));
};
