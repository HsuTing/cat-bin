'use strict';

import getOptions from 'utils/getOptions';

describe('get options', () => {
  it('# silent', () => {
    const {print} = getOptions([], [
      '-s'
    ]);

    expect(print('message')).toBe('message');
  });

  it('# not silent', () => {
    const {print} = getOptions([], []);

    expect(print('message')).toBeUndefined();
  });
});
