'use strict';

const fs = require('fs');
const path = require('path');
const process = require('process');
const commandLineArgs = require('command-line-args');
const chalk = require('chalk');
const Koa = require('koa');
const body = require('koa-body');
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

  if(fs.existsSync(root)) {
    rimraf(root, () => {
      fs.mkdirSync(root);
    });
  } else
    fs.mkdirSync(root);

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

      if(!fs.existsSync(fileFolder))
        fs.mkdirSync(fileFolder);

      const filePath = path.resolve(fileFolder, file.name);
      const reader = fs.createReadStream(file.path);
      const stream = fs.createWriteStream(filePath);

      reader.pipe(stream);
      console.log(
        'upload %s',
        filePath.replace(root, '.')
      );
    });

    return next();
  });

  app.listen(port, () => {
    console.log(chalk.green(`[cat-bin server] open server at ${ip.address()}:${port}`));
  });
};
