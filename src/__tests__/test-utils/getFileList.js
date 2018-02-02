'use strict';

import fs from 'fs';
import path from 'path';

import {
  defaultNpmIgnore,
  defaultGitIgnore,
  getFileList,
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
  it('# use .npmignore', () => {
    expect(
      getIngoreRules('.npmignore')
        .sort()
    ).toMatchObject(
      [
        ...defaultNpmIgnore,
        ...getIgnore('.npmignore')
      ].sort().map(rule => `**/${rule}`)
    );
  });

  it('# use .gitignore', () => {
    expect(
      getIngoreRules('.gitignore')
        .sort()
    ).toMatchObject(
      [
        ...defaultGitIgnore,
        ...getIgnore('.gitignore')
      ].sort().map(rule => `**/${rule}`)
    );
  });

  it('# do not use .gitignore or .npmignore', () => {
    expect(
      getIngoreRules('.ignore')
    ).toMatchObject([]);
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
