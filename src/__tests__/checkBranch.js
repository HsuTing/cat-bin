'use strict';

import gitConfig from 'git-config';

import checkBranch, {
  findProjectName
} from './../checkBranch';

test('check branch', async () => {
  expect(await checkBranch([
    '-t',
    (gitConfig.sync().alias || {}).token || process.env.github_token
  ])).toMatchObject({
    master: {
      remote: true,
      states: 'not merged'
    }
  });
});

test('find project name', () => {
  expect(
    findProjectName(__dirname)
  ).toBe('cat-bin');
});
