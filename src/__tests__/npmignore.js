'use strict';

import npmignore from './../npmignore';

test('npmignore', () => {
  expect(npmignore())
    .toBeUndefined();
});
