'use strict';

import upload from 'utils/upload';

import buildServer, {
  testFilePath
} from './../utils/upload-server';

describe('utils/upload', () => {
  it('# success', async () => {
    const {server, port} = await buildServer();

    expect(
      await upload('localhost', port, console.log, [
        testFilePath
      ])
    ).toMatchObject({
      statusCode: 200
    });

    expect(
      await upload('localhost', port, console.log, [
        testFilePath,
        testFilePath
      ])
    ).toMatchObject({
      statusCode: 200
    });

    server.close();
  });

  it('# fail', () => {
    expect(
      upload('localhost', 8000, console.log, [
        testFilePath
      ])
    ).rejects.toThrowError('connect ECONNREFUSED 127.0.0.1:8000');
  });
});
