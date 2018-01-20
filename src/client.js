// @flow
'use strict';

import watch from 'node-watch';
import ignore from 'ignore';

import getOptions from 'utils/getOptions';
import {getFileListWithFilter, getIngoreRules} from 'utils/getFileList';
import upload from 'utils/upload';

export default async (
  argv: Array<string>
) => {
  const {
    host,
    port,
    ignore: addIgnore,
    print
  }: {
    host: string,
    port: number,
    ignore: Array<string>,
    print: Function
  } = getOptions([{
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
  }], argv);

  const ig = ignore().add(getIngoreRules('.gitignore', addIgnore));
  const files: Array<string> = getFileListWithFilter('.gitignore', addIgnore);

  await upload(host, port, print, files);

  return watch(process.cwd(), {
    recursive: true,
    filter: /* istanbul ignore next */ name => ig.filter(name).length !== 0
  }, /* istanbul ignore next */ (
    evt: string,
    name: string
  ): void => {
    if(evt === 'update')
      upload(host, port, print, [name]);
  });
};
