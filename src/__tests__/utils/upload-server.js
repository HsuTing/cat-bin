'use strict';

import path from 'path';
import Koa from 'koa';
import body from 'koa-body';
import getPort from 'get-port';

import {testFilePath} from './test-files';

export * from './test-files';

export default async () => {
  const app = new Koa();
  const port = await getPort();

  app.use(body({multipart: true}));
  app.use((ctx, next) => {
    const {files, fields} = ctx.request.body;

    expect(files).toMatchObject({
      upload: {
        name: 'test.js'
      }
    });

    expect(
      fields.filePaths.replace(/\/dir/g, '')
    ).toBe(
      JSON.stringify([
        path.dirname(testFilePath).replace(process.cwd(), '.')
      ])
    );

    ctx.status = 200;
    return next();
  });

  return {
    server: app.listen(port, () => {
      console.log(`server run at port: ${port}`);
    }),
    port
  };
};
