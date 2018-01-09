'use strict';

var ip = require('ip');

module.exports = function () {
  console.log(ip.address());
};