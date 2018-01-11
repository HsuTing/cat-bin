'use strict';

import fs from 'fs';
import path from 'path';

import {
  getFileList,
  defaultIgnore,
  getIngoreRules,
  getFileListWithFilter
} from 'utils/getFileList';

import {
  testFolderPath,
  testFiles,
  testIgnore
} from './../utils/test-files';

const getIgnore = name => fs.readFileSync(
  path.resolve(process.cwd(), name),
  'utf-8'
).split(/\n/)
  .filter(pattern => pattern !== '');

test('get file list', () => {
  expect(
    getFileList(testFolderPath)
      .filter(name => !(/.*.swp/.test(name)))
      .map(name => name.replace(testFolderPath, '').replace('.js', ''))
  ).toMatchObject(testFiles);
});

describe('get ignore rules', () => {
  it('# have .npmignore', () => {
    expect(
      getIngoreRules('./.npmignore')
        .sort()
    ).toMatchObject(
      [
        ...defaultIgnore,
        ...getIgnore('./.npmignore')
      ].sort().map(rule => `**/${rule}`)
    );
  });

  it('# do not have .npmignore', () => {
    expect(
      getIngoreRules('./test.js')
    ).toMatchObject(
      defaultIgnore.map(rule => `**/${rule}`)
    );
  });
});

test('get file list with filter', () => {
  expect(
    getFileListWithFilter(
      testFolderPath, [
        ...getIgnore('./.gitignore'),
        ...testIgnore
      ]
    ).map(name => {
      return name.replace(testFolderPath, '')
        .replace('.js', '');
    }).sort()
  ).toMatchObject(testFiles);
});
