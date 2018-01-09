'use strict';

import nodeFs from 'fs';
import path from 'path';
import process from 'process';
import commandLineArgs from 'command-line-args';
import chalk from 'chalk';
import Koa from 'koa';
import body from 'koa-body';
import memFs from 'mem-fs';
import editor from 'mem-fs-editor';
import rimraf from 'rimraf';
import ip from 'ip';

const app = new Koa();

export default argv => {
  const {port, folder} = commandLineArgs([{
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

  const root = path.resolve(process.cwd(), folder);

  if(nodeFs.existsSync(root)) {
    rimraf(root, () => {
      nodeFs.mkdirSync(root);
    });
  } else
    nodeFs.mkdirSync(root);

  app.use(body({multipart: true}));
  app.use((ctx, next) => {
    const {files, fields} = ctx.request.body;
    const {filePaths: filePathsString} = fields;
    const filePaths = JSON.parse(filePathsString);

    if(!files) {
      ctx.status = 204;
      return next();
    }

    ctx.body = [];
    const data = (
      files.upload instanceof Array ?
        files.upload :
        [files.upload]
    );

    data.forEach((file, fileIndex) => {
      const fileFolder = path.resolve(root, filePaths[fileIndex]);
      const store = memFs.create();
      const fs = editor.create(store);
      const filePath = path.resolve(fileFolder, file.name);

      fs.copy(file.path, filePath);
      fs.commit(err => {
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
