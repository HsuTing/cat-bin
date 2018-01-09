'use strict';

const fs = require('fs');
const path = require('path');
const process = require('process');
const commandLineArgs = require('command-line-args');
const npmCheck = require('npm-check');
const chalk = require('chalk');
const columnify = require('columnify');

const root = process.cwd();
const babelPath = path.resolve(root, './.babelrc');
let alias = {};

if(fs.existsSync(babelPath)) {
  const {plugins} = JSON.parse(fs.readFileSync(babelPath));

  alias = plugins.slice(-1)[0][1].alias || {};
}

module.exports = argv => {
  if(!fs.existsSync(path.resolve(root, 'package.json')))
    return;

  const {ignore} = commandLineArgs([{
    name: 'ignore',
    alias: 'i',
    type: String,
    multiple: true,
    defaultValue: []
  }], {
    argv
  });

  npmCheck({
    ignore: [
      ...ignore,
      ...Object.keys(alias)
    ]
  }).then(currentState => {
    const output = currentState.get('packages')
      .reduce((result, pkg) => {
        const bumpInstalled = pkg.bump ? pkg.installed : '';
        const installed = pkg.mismatch ? pkg.packageJson : bumpInstalled;
        const name = chalk.yellow(pkg.moduleName);
        const homepage = pkg.homepage ? chalk.blue.underline(pkg.homepage) : '';

        let status = 'normal';

        if(pkg.notInstalled)
          status = 'missing';
        else if(pkg.notInPackageJson)
          status = 'notInPkg';
        else if(pkg.unused)
          status = 'unused';
        else if(pkg.bump && pkg.easyUpgrade)
          status = 'update';
        else if(pkg.bump && !pkg.easyUpgrade)
          status = 'new';

        if(status === 'normal')
          return result;

        result[status].push({
          col_1: [
            name,
            pkg.devDependency ? chalk.green('devDep') : '' // type
          ].filter(message => message !== '').join(' '),

          col_2: [
            installed,
            installed && '❯',
            chalk.bold(pkg.latest || '')
          ].filter(message => message !== '').join(' '),

          col_3: [
            pkg.latest ? homepage : pkg.regError || pkg.pkgError
          ].filter(message => message !== '').join(' ')
        });

        return result;
      }, {
        new: [],
        update: [],
        unused: [],
        notInPkg: [],
        missing: []
      });

    Object.keys(output).forEach(status => {
      if(output[status].length === 0)
        return;

      console.log();
      console.log({
        new: chalk.bold.underline.green('New var.'),
        notInPkg: chalk.bold.underline.red('Not in the package.json.'),
        update: chalk.bold.underline.green('Update.'),
        missing: chalk.bold.underline.red('Missing.'),
        unused: chalk.bold.underline.white('Not used.')
      }[status]);

      console.log(columnify(
        output[status], {
          showHeaders: false,
          columnSplitter: '  ',
          preserveNewLines: false,
          config: {
            col_2: {
              align: 'center'
            }
          }
        }
      ));
    });
  });
};
