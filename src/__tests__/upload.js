'use strict';

import upload from 'upload';

import buildServer, {
  testFilePath,
  testFolderPath
} from './utils/upload-server';

let server = null;
let port = null;

describe('upload', () => {
  beforeAll(async () => {
    const newServer = await buildServer();

    server = newServer.server;
    port = newServer.port;
  });

  it('# file', async () => {
    expect(
      await upload([
        testFilePath,
        '-p',
        port
      ])
    ).toBeUndefined();
  });

  it('# folder', async () => {
    expect(
      await upload([
        testFolderPath,
        '-p',
        port
      ])
    ).toBeUndefined();
  });

  afterAll(() => {
    server.close();
  });
});
