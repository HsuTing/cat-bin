'use strict';

var fs = require('fs');
var path = require('path');
var process = require('process');
var FormData = require('form-data');

var upload = function upload(host, port, filesData) {
  var form = new FormData();
  var filePathArray = [];
  var files = filesData.filter(function (file) {
    return fs.lstatSync(file).isFile();
  });

  if (files.length === 0) return;

  var uploadFiles = files.splice(0, 1);

  uploadFiles.forEach(function (file) {
    var filePath = file.replace(process.cwd(), '.');

    form.append('upload', fs.createReadStream(file));
    filePathArray.push(path.dirname(file).replace(process.cwd(), '.'));
    console.log('upload %s', filePath);
  });
  form.append('filePaths', JSON.stringify(filePathArray));
  form.submit({
    host: host,
    path: '/',
    port: port
  }, function (err, res) {
    if (err) throw new Error(err);

    res.resume();
    upload(host, port, files);
  });
};

module.exports = upload;