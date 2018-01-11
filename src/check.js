// @flow
'use strict';

import fs from 'fs';
import path from 'path';
import commandLineArgs from 'command-line-args';
import npmCheck from 'npm-check';
import chalk from 'chalk';
import columnify from 'columnify';

type rowType = {
  col_1: Array<string>,
  col_2: Array<string>,
  col_3: Array<string>
};
type dataType = {
  new: Array<rowType>,
  update: Array<rowType>,
  unused: Array<rowType>,
  notInPkg: Array<rowType>,
  missing: Array<rowType>
};

const root: string = process.cwd();
const babelPath: string = path.resolve(root, './.babelrc');
let alias: {
  [string]: string
} = {};

/* istanbul ignore else */
if(fs.existsSync(babelPath)) {
  const {
    plugins
  }: {
    plugins: Array<Array<{alias?: {[string]: string}}>>
  } = JSON.parse(fs.readFileSync(babelPath, {encoding: 'utf-8'}));

  alias = plugins.slice(-1)[0][1].alias || {};
}

export default async (
  argv: Array<string>
): ?Promise<void> => {
  /* istanbul ignore if */
  if(!fs.existsSync(path.resolve(root, 'package.json')))
    return;

  const {
    ignore
  }: {
    ignore: Array<string>
  } = commandLineArgs([{
    name: 'ignore',
    alias: 'i',
    type: String,
    multiple: true,
    defaultValue: []
  }], {
    argv
  });

  const currentState: {
    get: Function
  } = await npmCheck({
    ignore: [
      ...ignore,
      ...Object.keys(alias)
    ]
  });

  const output: dataType = currentState.get('packages')
    .reduce(/* istanbul ignore next */ (
      result: dataType,
      pkg: {
        installed: string,
        bump: string,
        mismatch: string,
        packageJson: string,
        moduleName: string,
        homepage: string,
        notInstalled: boolean,
        notInPackageJson: boolean,
        easyUpgrade: boolean,
        pkgError: string,
        latest: string
      }
    ): dataType => {
      const bumpInstalled: string = pkg.bump ? pkg.installed : '';
      const installed: string = pkg.mismatch ? pkg.packageJson : bumpInstalled;
      const name: string = chalk.yellow(pkg.moduleName);
      const homepage: string = pkg.homepage ? chalk.blue.underline(pkg.homepage) : '';
      let status: string = 'normal';

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

  Object.keys(output).forEach((
    status: string
  ): void => {
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
};
