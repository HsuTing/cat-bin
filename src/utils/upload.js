// @flow
'use strict';

import fs from 'fs';
import path from 'path';
import FormData from 'form-data';

type fileType = Array<string>;

const upload: Function = (
  host: string,
  port: number,
  filesData: fileType
): Promise<{}> => new Promise((resolve, reject) => {
  const files: fileType = filesData.filter(file => fs.lstatSync(file).isFile());

  if(files.length === 0)
    return resolve({});

  const form = new FormData();
  const file = files[0];

  form.append('upload', fs.createReadStream(file));
  form.append('filePaths', JSON.stringify([
    path.dirname(file).replace(process.cwd(), '.')
  ]));
  console.log(`upload ${file.replace(process.cwd(), '.')}`);

  form.submit({
    host,
    path: '/',
    port
  }, (
    err: ?string,
    res: {
      resume: Function
    }
  ): void => {
    /* istanbul ignore if */
    if(err)
      return reject(err);

    res.resume();
    upload(host, port, files.splice(1))
      .then(() => resolve(res))
      .catch(/* istanbul ignore next */ err => reject(err));
  });
});

export default upload;
