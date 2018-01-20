// @flow
'use strict';

import path from 'path';
import chalk from 'chalk';

import getOptions from 'utils/getOptions';
import {getFileListWithFilter} from 'utils/getFileList';

const root: string = process.cwd();

type filesType = {
  [string]: Array<string>
};

const files: filesType = getFileListWithFilter('.npmignore')
  .reduce((
    result: filesType,
    filePath: string
  ) => {
    const newPath: string = (
      path.extname(filePath) !== '' ?
        `${path.dirname(filePath)}/*${path.extname(filePath)}` :
        filePath
    );

    if(result[newPath])
      result[newPath].push(filePath);
    else
      result[newPath] = [filePath];

    return result;
  }, {});

export default (
  argv: Array<string>
): void => {
  const {
    print
  }: {
    print: Function
  } = getOptions([], argv);

  Object.keys(files)
    .forEach((
      key: string
    ): void => {
      if(files[key].length === 1)
        print(files[key][0].replace(root, '.'));
      else
        print(`${key.replace(root, '.')} ${chalk.green(`(${files[key].length})`)}`);
    });
};
