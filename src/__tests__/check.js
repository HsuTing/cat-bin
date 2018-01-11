'use strict';

import check from './../check';

test('check', async () => {
  expect(await check([]))
    .toBeUndefined();
});
