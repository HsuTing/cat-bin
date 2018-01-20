'use strict';

import checkNpm from './../checkNpm';

test('check npm', () => {
  expect(checkNpm())
    .toMatchObject({});
});
