// @flow
'use strict';

import 'fetch-everywhere';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import gitConfig from 'git-config';
import simpleGit from 'simple-git';

import getOptions from 'utils/getOptions';

type branchType = {
  url?: ?string,
  remote?: boolean,
  local?: boolean,
  states?: string
};

type branchsType = {
  [string]: branchType
};

type pullRequestNodeType = {
  url: string
};

type refNodeType = {
  name: string,
  associatedPullRequests: {
    nodes: Array<pullRequestNodeType>
  }
};

const fetchGithub = (
  token: string,
  query: string
): Promise<{
  data: {
    repository: {
      refs: {
        totalCount: number,
        nodes: Array<refNodeType>
      }
    }
  }
}> => fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: {
    Authorization: `bearer ${token}`
  },
  body: JSON.stringify({query})
}).then(res => res.json());

const getLocalBranchs: Promise<Array<string>> = new Promise((resolve, reject) => {
  const localGit = simpleGit();

  localGit.branchLocal((err, data) => {
    /* istanbul ignore if */
    if(err)
      return reject(err);

    return resolve(data.all);
  });
});

export const findProjectName = (
  nowPath: string
): string => {
  const gitFolder: string = path.resolve(nowPath, '.git');

  if(fs.existsSync(gitFolder))
    return path.basename(nowPath);

  return findProjectName(
    path.resolve(nowPath, './../')
  );
};
const projectName: string = findProjectName(process.cwd());

export default async (
  argv: Array<string>
): Promise<branchsType> => {
  const config: {
    alias: {
      token: ?string
    }
  } = gitConfig.sync();
  const {
    token,
    print
  }: {
    token: string,
    print: Function
  } = getOptions([{
    name: 'token',
    alias: 't',
    type: String,
    defaultValue: config.alias.token
  }], argv);

  /* istanbul ignore if */
  if(!token) {
    print(chalk`
  Need to give the personal access tokens.
  Generate new token: {blue.underline https://github.com/settings/tokens}.

  After generating token, run the command with {green --token} or {green -t}. ex: --token <token>.
  This is recommended to use {green git config --global alias.token "<token>"} to set token in .gitconfig
    `);
    return {};
  }

  const totalCount: number = (await fetchGithub(
    token,
    `query {
      repository(
        owner: "HsuTing"
        name: "${projectName}"
      ) {
        refs(
          first: 1,
          refPrefix: "refs/heads/"
        ) {
          totalCount
        }
      }
    }`
  )).data.repository.refs.totalCount;

  const data: Array<refNodeType> = (await fetchGithub(
    token,
    `query {
      repository(
        owner: "HsuTing"
        name: "${projectName}"
      ) {
        refs(
          first: ${totalCount},
          refPrefix: "refs/heads/"
        ) {
          nodes {
            name
            associatedPullRequests(
              first: 5
              states: MERGED
              orderBy: {
                field: CREATED_AT
                direction: DESC
              }
            ) {
              nodes {
                url
              }
            }
          }
        }
      }
    }`
  )).data.repository.refs.nodes;

  const branchs: branchsType = data.reduce((result, {
    name,
    associatedPullRequests
  }: refNodeType): branchsType => {
    const nodes: Array<pullRequestNodeType> = associatedPullRequests.nodes;

    result[name] = (
      nodes.length === 0 ?
        {
          remote: true,
          states: 'not merged'
        } : /* istanbul ignore next */ {
          url: nodes[0].url,
          remote: true,
          states: 'merged'
        }
    );

    return result;
  }, {});

  (await getLocalBranchs).forEach(branchName => {
    /* istanbul ignore if */
    if(!branchs[branchName])
      branchs[branchName] = {};

    branchs[branchName].local = true;
  });

  /* istanbul ignore next */
  Object.keys(branchs).forEach(branchName => {
    const {
      url,
      states,
      local,
      remote
    }: branchType = branchs[branchName];
    let output: string = '';

    if(states === 'merged')
      output += chalk`{bgRed.whiteBright.bold  ✘ ${branchName} }`;
    else
      output += chalk`{bgGreen.whiteBright.bold   ${branchName} }`;

    if(local)
      output += chalk`{gray  (local)}`;

    if(remote)
      output += chalk`{gray  (remote)}`;

    print(output);

    if(states === 'merged') {
      print();

      if(local)
        print(chalk`  delete local branch: {cyan git branch -d ${branchName}}`);

      if(remote) {
        print(chalk`  delete remote branch: {cyan git push origin --delete ${branchName}}`);
        print(chalk`  use delete branch button: {blue.underline ${url}}`);
      }

      print();
    }
  });

  return branchs;
};
