# Cat-bin [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

## Getting Started
Install packages using [yarn](https://yarnpkg.com/) (we assume you have pre-installed [npm](https://www.npmjs.com/) and [node.js](https://nodejs.org/)).

- Install

  ```sh
  yarn global add cat-bin
  ```

- Example

  ```sh
  cat-bin [Arguments]
  ```

## Arguments
- check

  Check npm package with `npm-check`.
  - `ignore`, `-i`: Use to ignore dependencies that match specified glob.
  - Example:

    ```sh
    cat-bin check -i bundler-loader?*
    ```

- npmignore

  Show the structure of the folders with `.npmignore`.
  - Example:

    ```sh
    cat-bin npmignore
    ```

- server

  Open a server to get the files from `cat-bin client`.
  - `port`, `-p`: Use to set the port for the `server`.
  - Example:

    ```sh
    cat-bin server
    ```

- client

  Watch the files and post the files from `cat-bin server`.
  - `host`, `-h`: Use to set the host of the `server`.
  - `port`, `-p`: Use to set the port of the `server`.
  - `ignore`, `-i`: Use to ignore files that match specified glob.
  - Example:

    ```sh
    cat-bin client
    ```

- upload

  Send a file or a folder to `cat-bin server`.
  - `file`,`-f`: Use to choose file.
  - `host`, `-h`: Use to set the host of the `server`.
  - `port`, `-p`: Use to set the port of the `server`.
  - Example:

    ```sh
    cat-bin upload
    ```

- showIP

  Show local ip.
  - Example:

    ```sh
    cat-bin showIP
    ```

## License
MIT © [HsuTing](http://hsuting.com)

[npm-image]: https://badge.fury.io/js/cat-bin.svg
[npm-url]: https://npmjs.org/package/cat-bin
[travis-image]: https://travis-ci.org/HsuTing/cat-bin.svg?branch=master
[travis-url]: https://travis-ci.org/HsuTing/cat-bin
