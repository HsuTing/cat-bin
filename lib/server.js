'use strict';

var nodeFs = require('fs');
var path = require('path');
var process = require('process');
var commandLineArgs = require('command-line-args');
var chalk = require('chalk');
var Koa = require('koa');
var body = require('koa-body');
var memFs = require('mem-fs');
var editor = require('mem-fs-editor');
var rimraf = require('rimraf');
var ip = require('ip');

var app = new Koa();

module.exports = function (argv) {
  var _commandLineArgs = commandLineArgs([{
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
    argv: argv
  }),
      port = _commandLineArgs.port,
      folder = _commandLineArgs.folder;

  var root = path.resolve(process.cwd(), folder);

  if (nodeFs.existsSync(root)) {
    rimraf(root, function () {
      nodeFs.mkdirSync(root);
    });
  } else nodeFs.mkdirSync(root);

  app.use(body({ multipart: true }));
  app.use(function (ctx, next) {
    var _ctx$request$body = ctx.request.body,
        files = _ctx$request$body.files,
        fields = _ctx$request$body.fields;
    var filePathsString = fields.filePaths;

    var filePaths = JSON.parse(filePathsString);

    if (!files) {
      ctx.status = 204;
      return next();
    }

    ctx.body = [];
    var data = files.upload instanceof Array ? files.upload : [files.upload];

    data.forEach(function (file, fileIndex) {
      var fileFolder = path.resolve(root, filePaths[fileIndex]);
      var store = memFs.create();
      var fs = editor.create(store);
      var filePath = path.resolve(fileFolder, file.name);

      fs.copy(file.path, filePath);
      fs.commit(function (err) {
        if (err) return console.log(err);

        console.log('upload %s', filePath.replace(root, '.'));
      });
    });

    return next();
  });

  app.listen(port, function () {
    console.log(chalk.green('[cat-bin server] open server at ' + ip.address() + ':' + port));
  });
};