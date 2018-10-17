# ts-transform-inferno

[![travis](https://travis-ci.org/deamme/ts-transform-inferno.svg?branch=master)](https://travis-ci.org/deamme/ts-transform-inferno)
[![npm version](https://badge.fury.io/js/ts-transform-inferno.svg)](https://badge.fury.io/js/ts-transform-inferno)

Typescript transformer for [InfernoJS](https://github.com/infernojs/inferno).

A Typescript transformer is like a plugin to the Typescript compiler, so if you're using Typescript anyway in your project you don't need Babel as a dependency.

# Install

`yarn add -D ts-transform-inferno typescript`

## General usage

```javascript
const transformInferno = require('ts-transform-inferno').default

transformInferno()
```

It's different depending on what bundler you're using. Please check the examples folder.

### Usage with css-modules-next

Check out the examples folder [here](https://github.com/deamme/ts-transform-css-modules-next).

### Usage with classcat

The examples are already using this. It's a custom transformer than comes before ts-transform-inferno. More about it [here](https://github.com/deamme/ts-transform-classcat).

## Usage with FuseBox (recommended)

Look into the `examples/fuse-box` folder and the `fuse.js` file.

You could also try to build the project by running the following commands:

`cd examples/fuse-box && npm install`

`npm run start:dev` or `npm run start:prod`

## Usage with webpack and ts-loader

Look into the `examples/webpack` folder and its webpack config.

You could also try to build the project by running the following commands:

`cd examples/webpack && npm install`

`npm run build:prod` or `npm start`

## Testing

You can run the following command to test: `npm test`

### Adding test cases

Write your test in a `.tsx` file and add it to `tests/cases`.

Compile with `npm test` and look into the `tests/temp` and verify.

Overwrite references by running the following command: `npm run overwrite-references`

Run `npm test` again to verify that all tests are passing.

## Credits

Very much inspired by these projects:

- [inferno-typescript-example](https://github.com/infernojs/inferno-typescript-example)
- [ts-transform-css-modules](https://github.com/longlho/ts-transform-css-modules)
- [ts-transform-react-intl](https://github.com/longlho/ts-transform-react-intl)
- [babel-plugin-inferno](https://github.com/infernojs/babel-plugin-inferno)
- [TypeScript](https://github.com/Microsoft/TypeScript)
- [hyperapp-fusebox](https://github.com/osdevisnot/hyperapp-fusebox)
