'use strict';

const ip = require('ip');

module.exports = () => {
  console.log(ip.address());
};
