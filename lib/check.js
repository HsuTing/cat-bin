'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var fs = require('fs');
var path = require('path');
var process = require('process');
var commandLineArgs = require('command-line-args');
var npmCheck = require('npm-check');
var chalk = require('chalk');
var columnify = require('columnify');

var root = process.cwd();
var babelPath = path.resolve(root, './.babelrc');
var alias = {};

if (fs.existsSync(babelPath)) {
  var _JSON$parse = JSON.parse(fs.readFileSync(babelPath)),
      plugins = _JSON$parse.plugins;

  alias = plugins.slice(-1)[0][1].alias || {};
}

module.exports = function (argv) {
  if (!fs.existsSync(path.resolve(root, 'package.json'))) return;

  var _commandLineArgs = commandLineArgs([{
    name: 'ignore',
    alias: 'i',
    type: String,
    multiple: true,
    defaultValue: []
  }], {
    argv: argv
  }),
      ignore = _commandLineArgs.ignore;

  npmCheck({
    ignore: [].concat(_toConsumableArray(ignore), _toConsumableArray(Object.keys(alias)))
  }).then(function (currentState) {
    var output = currentState.get('packages').reduce(function (result, pkg) {
      var bumpInstalled = pkg.bump ? pkg.installed : '';
      var installed = pkg.mismatch ? pkg.packageJson : bumpInstalled;
      var name = chalk.yellow(pkg.moduleName);
      var homepage = pkg.homepage ? chalk.blue.underline(pkg.homepage) : '';

      var status = 'normal';

      if (pkg.notInstalled) status = 'missing';else if (pkg.notInPackageJson) status = 'notInPkg';else if (pkg.unused) status = 'unused';else if (pkg.bump && pkg.easyUpgrade) status = 'update';else if (pkg.bump && !pkg.easyUpgrade) status = 'new';

      if (status === 'normal') return result;

      result[status].push({
        col_1: [name, pkg.devDependency ? chalk.green('devDep') : '' // type
        ].filter(function (message) {
          return message !== '';
        }).join(' '),

        col_2: [installed, installed && '❯', chalk.bold(pkg.latest || '')].filter(function (message) {
          return message !== '';
        }).join(' '),

        col_3: [pkg.latest ? homepage : pkg.regError || pkg.pkgError].filter(function (message) {
          return message !== '';
        }).join(' ')
      });

      return result;
    }, {
      new: [],
      update: [],
      unused: [],
      notInPkg: [],
      missing: []
    });

    Object.keys(output).forEach(function (status) {
      if (output[status].length === 0) return;

      console.log();
      console.log({
        new: chalk.bold.underline.green('New var.'),
        notInPkg: chalk.bold.underline.red('Not in the package.json.'),
        update: chalk.bold.underline.green('Update.'),
        missing: chalk.bold.underline.red('Missing.'),
        unused: chalk.bold.underline.white('Not used.')
      }[status]);

      console.log(columnify(output[status], {
        showHeaders: false,
        columnSplitter: '  ',
        preserveNewLines: false,
        config: {
          col_2: {
            align: 'center'
          }
        }
      }));
    });
  });
};