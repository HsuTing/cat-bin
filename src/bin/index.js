#!/usr/bin/env node
// @flow
'use strict';

import 'babel-polyfill';
import path from 'path';

process.on('unhandledRejection', (
  err: string
): void => {
  throw new Error(err);
});

if(process.argv[2]) {
  require(
    path.resolve(
      __dirname,
      './../',
      process.argv[2]
        .split(/-/)
        .map((
          text: string,
          index: number
        ): string => index === 0 ? text : text[0].toUpperCase() + text.slice(1))
        .join('')
    )
  ).default(
    process.argv.slice(3)
  );
} else
  throw new Error('You must give a argument.');
