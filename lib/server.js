'use strict';

const nodeFs = require('fs');
const path = require('path');
const process = require('process');
const commandLineArgs = require('command-line-args');
const chalk = require('chalk');
const Koa = require('koa');
const body = require('koa-body');
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const rimraf = require('rimraf');
const ip = require('ip');

const app = new Koa();
const root = path.resolve(process.cwd(), './project');

module.exports = argv => {
  const {port} = commandLineArgs([{
    name: 'port',
    alias: 'p',
    type: Number,
    defaultValue: 8000
  }], {
    argv
  });

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
