// @flow
'use strict';

import commandLineArgs from 'command-line-args';
import watch from 'node-watch';
import ignore from 'ignore';

import {getFileListWithFilter, getIngoreRules} from 'utils/getFileList';
import upload from 'utils/upload';

export default async (
  argv: Array<string>
) => {
  const {
    host,
    port,
    ignore: addIgnore
  }: {
    host: string,
    port: number,
    ignore: Array<string>
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
    name: 'ignore',
    alias: 'i',
    type: String,
    multiple: true,
    defaultValue: []
  }], {
    argv
  });

  const ig = ignore().add(getIngoreRules('.gitignore', addIgnore));
  const files: Array<string> = getFileListWithFilter('.gitignore', addIgnore);

  await upload(host, port, files);

  return watch(process.cwd(), {
    recursive: true,
    filter: /* istanbul ignore next */ name => ig.filter(name).length !== 0
  }, /* istanbul ignore next */ (
    evt: string,
    name: string
  ): void => {
    if(evt === 'update')
      upload(host, port, [name]);
  });
};
