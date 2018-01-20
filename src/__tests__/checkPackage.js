'use strict';

import checkPackage from './../checkPackage';

test('check package', async () => {
  jest.setTimeout(7500);
  expect(await checkPackage([]))
    .toMatchObject({});
});
