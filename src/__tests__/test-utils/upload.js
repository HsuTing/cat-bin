'use strict';

import upload from 'utils/upload';

import buildServer, {
  testFilePath
} from './../utils/upload-server';

describe('utils/upload', () => {
  it('# success', async () => {
    const {server, port} = await buildServer();

    expect(
      await upload('localhost', port, [
        testFilePath
      ])
    ).toMatchObject({
      statusCode: 200
    });

    expect(
      await upload('localhost', port, [
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
      upload('localhost', 8000, [
        testFilePath
      ])
    ).rejects.toThrowError('connect ECONNREFUSED 127.0.0.1:8000');
  });
});
