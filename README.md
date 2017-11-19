# Cat-bin

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

  Check npm package with `npm-check` and `alias` in `.babelrc`.
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
  - Example:

    ```sh
    cat-bin client
    ```
