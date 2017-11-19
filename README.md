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

  Use to check npm package with `npm-check` and `alias` in `.babelrc`.
  - `ignore`, `-i`: Use to ignore dependencies that match specified glob.
  - Example:

    ```sh
    cat-bin check -i bundler-loader?*
    ```

- npmignore

  Use to show the structure of the folders with `.npmignore`.
  - Example:

    ```sh
    cat-bin npmignore
    ```
