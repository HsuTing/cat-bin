#!/usr/bin/env node
'use strict';

const path = require('path');
const process = require('process');

require(path.resolve(__dirname, process.argv[2]))(
  process.argv.slice(3)
);
