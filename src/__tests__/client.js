'use strict';

import client from './../client';
import buildServer, {
  testIgnore
} from './utils/upload-server';

test('client', async () => {
  const {server, port} = await buildServer();
  const watcher = await client([
    '-p',
    port,
    '-i',
    ...testIgnore
  ]);

  watcher.close();
  server.close();

  expect(
    watcher.isClosed()
  ).toBe(true);
});
