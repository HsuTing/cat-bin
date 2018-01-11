// @flow
'use strict';

import nodeFs from 'fs';
import path from 'path';
import commandLineArgs from 'command-line-args';
import chalk from 'chalk';
import Koa from 'koa';
import body from 'koa-body';
import memFs from 'mem-fs';
import editor from 'mem-fs-editor';
import rimraf from 'rimraf';
import ip from 'ip';

type fileType = {
  name: string,
  path: string
};

type fileFieldType = {
  upload: Array<fileType> | fileType
};

const app: Koa = new Koa();

export default (
  argv: Array<string>
): void => {
  const {
    port,
    folder
  }: {
    port: number,
    folder: string
  } = commandLineArgs([{
    name: 'port',
    alias: 'p',
    type: Number,
    defaultValue: 8000
  }, {
    name: 'folder',
    alias: 'f',
    type: String,
    defaultValue: './project'
  }], {
    argv
  });

  const root: string = path.resolve(process.cwd(), folder);

  if(nodeFs.existsSync(root)) {
    rimraf(root, (): void => {
      nodeFs.mkdirSync(root);
    });
  } else
    nodeFs.mkdirSync(root);

  app.use(body({multipart: true}));
  app.use((
    ctx: {
      status: number,
      body: Array<string>,
      request: {
        body: {
          files: fileFieldType,
          fields: {
            filePaths: string
          }
        }
      }
    },
    next: Function
  ) => {
    const {
      files,
      fields
    }: {
      files: fileFieldType,
      fields: {
        filePaths: string
      }
    } = ctx.request.body;
    const {
      filePaths: filePathsString
    }: {
      filePaths: string
    } = fields;
    const filePaths: Array<string> = JSON.parse(filePathsString);

    if(!files) {
      ctx.status = 204;
      return next();
    }

    ctx.body = [];
    const data: Array<fileType> = (
      files.upload instanceof Array ?
        files.upload :
        [files.upload]
    );

    data.forEach((
      file: fileType,
      fileIndex: number
    ): void => {
      const fileFolder: string = path.resolve(root, filePaths[fileIndex]);
      const store = memFs.create();
      const fs = editor.create(store);
      const filePath: string = path.resolve(fileFolder, file.name);

      fs.copy(file.path, filePath);
      fs.commit((
        err: ?string
      ): void => {
        if(err)
          return console.log(err);

        console.log(
          'upload %s',
          filePath.replace(root, '.')
        );
      });
    });

    return next();
  });

  app.listen(port, () => {
    console.log(chalk.green(`[cat-bin server] open server at ${ip.address()}:${port}`));
  });
};
