#!/usr/bin/env node
'use strict';

const path = require('path');
const process = require('process');

if(process.argv[2]) {
  require(path.resolve(__dirname, process.argv[2]))(
    process.argv.slice(3)
  );
} else
  throw new Error('You must give a argument.');
