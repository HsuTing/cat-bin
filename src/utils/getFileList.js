// @flow
'use strict';

import fs from 'fs';
import path from 'path';
import ignore from 'ignore';

export const getFileList: Function = (
  root: string
): Array<string> => fs.readdirSync(root).reduce((
  result: Array<string>,
  file: string
): Array<string> => {
  const childFilePath: string = path.resolve(root, file);

  if(fs.lstatSync(childFilePath).isDirectory())
    return result.concat(getFileList(childFilePath));
  else
    result.push(childFilePath);

  return result;
}, []);

export const defaultIgnore: Array<string> = [
  '.*.swp',
  '._*',
  '.DS_Store',
  '.git',
  '.hg',
  '.npmrc',
  '.lock-wscript',
  '.svn',
  '.wafpickle-*',
  'config.gypi',
  'CVS',
  'npm-debug.log',
  'node_modules',
  '.gitignore',
  '.npmignore',
  '!package.json',
  '!README',
  '!CHANGELOG',
  '!LICENSE',
  '!LICENCE'
];
export const getIngoreRules: Function = (
  ignoreFilePath: string,
  addIgnore: Array<string> = []
): Array<string> => {
  const ignorePath: string = path.resolve(process.cwd(), ignoreFilePath);
  const ignoreRules: Array<string> = (
    fs.existsSync(ignorePath) && fs.lstatSync(ignorePath).isFile() ? (
      fs.readFileSync(ignorePath, 'utf-8')
        .split(/\n/g)
        .filter(string => string !== '')
    ) : []
  );

  return [
    ...ignoreRules,
    ...addIgnore,
    ...defaultIgnore
  ].map(rule => `**/${rule}`);
};

export const getFileListWithFilter: Function = (
  ignoreFileName: string,
  addIgnore: Array<string>
) => ignore().add(
  getIngoreRules(ignoreFileName, addIgnore)
).filter(
  getFileList(process.cwd())
);
