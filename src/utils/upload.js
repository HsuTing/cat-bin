'use strict';

import fs from 'fs';
import path from 'path';
import process from 'process';
import FormData from 'form-data';

const upload = (host, port, filesData) => {
  const form = new FormData();
  const filePathArray = [];
  const files = filesData.filter(file => fs.lstatSync(file).isFile());

  if(files.length === 0)
    return;

  const uploadFiles = files.splice(0, 1);

  uploadFiles.forEach(file => {
    const filePath = file.replace(process.cwd(), '.');

    form.append('upload', fs.createReadStream(file));
    filePathArray.push(path.dirname(file).replace(process.cwd(), '.'));
    console.log('upload %s', filePath);
  });
  form.append('filePaths', JSON.stringify(filePathArray));
  form.submit({
    host,
    path: '/',
    port
  }, (err, res) => {
    if(err)
      throw new Error(err);

    res.resume();
    upload(host, port, files);
  });
};

module.exports = upload;
