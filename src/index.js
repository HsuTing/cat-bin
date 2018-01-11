#!/usr/bin/env node
// @flow
'use strict';

import path from 'path';

if(process.argv[2]) {
  require(path.resolve(__dirname, process.argv[2]))(
    process.argv.slice(3)
  );
} else
  throw new Error('You must give a argument.');
