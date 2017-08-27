# ts-transform-inferno
[![travis](https://travis-ci.org/deamme/ts-transform-inferno.svg?branch=master)](https://travis-ci.org/deamme/ts-transform-inferno)
[![npm version](https://badge.fury.io/js/ts-transform-inferno.svg)](https://badge.fury.io/js/ts-transform-inferno)

Typescript transformer for [InfernoJS](https://github.com/infernojs/inferno).

# Install
`npm install -D ts-transform-inferno`

or

`yarn add --dev ts-transform-inferno`

## Usage with webpack and ts-loader
Look into the `example` folder and its webpack config.

You could also try to build the project by running the following commands:

`cd example && npm install`

`npm run build` or `npm start`

## Testing
You can run the following command to test: `npm test`

### Adding test cases
Write your test in a `.tsx` file and add it to `tests/cases`.
Compile with `npm test` and look into the `tests/temp` and verify.
Overwrite references by running the following command: `npm run overwrite-references`
Run `npm test` again to verify that all tests are passing.

## Credits
Very much inspired by these projects:
- [ts-transform-css-modules](https://github.com/longlho/ts-transform-css-modules)
- [ts-transform-react-intl](https://github.com/longlho/ts-transform-react-intl)
- [babel-plugin-inferno](https://github.com/infernojs/babel-plugin-inferno)
- [TypeScript](https://github.com/Microsoft/TypeScript)

The example folder is shamelessly taken from [inferno-typescript-example](https://github.com/infernojs/inferno-typescript-example) with some slight modifications.
