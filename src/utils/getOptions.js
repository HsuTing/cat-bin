// @flow
'use strict';

import commandLineArgs from 'command-line-args';

type optionsType = {
  [string]: any,
  print: Function
};

const print = (
  silent: boolean
) => (
  message: string = ''
) => {
  if(!silent)
    return console.log(message);

  return message;
};

export default (
  options: Array<{
    name: string,
    alias: string,
    type: Function,
    defaultValue?: any
  }>,
  argv: Array<string>
): optionsType => {
  const {
    silent,
    ...otherOptions
  }: {
    [string]: any,
    silent: boolean
  } = commandLineArgs([
    ...options, {
      name: 'silent',
      alias: 's',
      type: Boolean,
      default: false
    }
  ], {
    argv
  });

  return {
    ...otherOptions,
    print: print(silent)
  };
};
