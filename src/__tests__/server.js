'use strict';

import fs from 'fs';
import path from 'path';
import getPort from 'get-port';
import FormData from 'form-data';

import app from './../server';
import {testFilePath} from './utils/test-files';

const upload = (max, port) => new Promise((resolve, reject) => {
  const form = new FormData();
  const filePaths = [];

  if(max !== 0) {
    [].constructor.apply({}, new Array(max)).forEach(() => {
      form.append('upload', fs.createReadStream(testFilePath));
      filePaths.push(
        path.dirname(testFilePath).replace(process.cwd(), '.')
      );
    });

    form.append('filePaths', JSON.stringify(filePaths));
  }

  form.submit({
    host: 'localhost',
    path: '/',
    port
  }, (err, res) => {
    if(err)
      return reject(err);

    res.resume();
    resolve(res);
  });
});

let server = null;
let port = null;

describe('server', async () => {
  beforeAll(async () => {
    port = await getPort();
    server = app([
      '-p',
      port
    ]);
  });

  it('# one file', async () => {
    expect(await upload(1, port)).toMatchObject({
      statusCode: 200
    });
  });

  it('# multiple files', async () => {
    expect(await upload(2, port)).toMatchObject({
      statusCode: 200
    });
  });

  it('# no file', async () => {
    expect(await upload(0, port)).toMatchObject({
      statusCode: 204
    });
  });

  afterAll(() => {
    server.close();
  });
});
