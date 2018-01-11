'use strict';

import path from 'path';

export const testFolderPath = path.resolve(__dirname, './test-files');
export const testFilePath = path.resolve(testFolderPath, './test.js');

export const testFiles = [
  '/dir/test',
  '/test'
];

export const testIgnore = [
  '.*',
  'README.md',
  'LICENSE',
  'jest.config.js',
  'package.json',
  'yarn.lock',
  'src/*.js',
  'src/bin/**',
  'src/utils/**',
  'src/__tests__/*.js',
  'src/__tests__/utils/*.js',
  'src/__tests__/test-utils/*.js'
];
