#!/usr/bin/env node
// @flow
'use strict';

import 'babel-polyfill';
import path from 'path';

if(process.argv[2]) {
  require(
    path.resolve(__dirname, './../', process.argv[2])
  ).default(
    process.argv.slice(3)
  );
} else
  throw new Error('You must give a argument.');
