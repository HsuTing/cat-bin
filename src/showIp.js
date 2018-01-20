// @flow
'use strict';

import ip from 'ip';

import getOptions from 'utils/getOptions';

export default (
  argv: Array<string>
): void => {
  const {
    print
  }: {
    print: Function
  } = getOptions([], argv);

  print(ip.address());
};
