import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import typescript from 'rollup-plugin-typescript2'
// const transformInferno = require('../../dist').default
import transformInferno from 'ts-transform-inferno'
console.log(transformInferno)
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import { uglify } from 'rollup-plugin-uglify'

const isProd = process.env.NODE_ENV === 'production'

const tsTransformer = () => ({
  before: [transformInferno()],
  after: [],
})

const config = {
  input: 'src/index.tsx',
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true,
      customResolveOptions: {
        packageFilter(pkg) {
          if (!isProd && pkg['dev:module'] != null) {
            pkg.main = pkg['dev:module']
          } else if (pkg.module != null) {
            pkg.main = pkg.module
          } else if (pkg['js:next'] != null) {
            pkg.main = pkg['js:next']
          }
          return pkg
        },
      },
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'production'
      ),
    }),
    typescript({
      transformers: [tsTransformer],
    }),
  ],
  output: {
    file: 'dist/app.js',
    format: 'iife',
  },
}

if (!isProd) {
  config.plugins.push(
    serve({
      verbose: false,
      contentBase: '.',
      historyApiFallback: true,
      host: '0.0.0.0',
      port: 3000,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }),
    livereload({
      watch: 'dist',
    })
  )
} else {
  config.plugins.push(uglify())
}

export default config
