const webpack = require('webpack');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const path = require("path");
const transformInferno = require("ts-transform-inferno").default;
// const transformInferno = require('../../dist').default

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist/"),
    filename: "bundle.js"
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },
  module: {
    rules: [
      {
        test: /\.tsx$/,
        loader: "ts-loader",
        options: {
          getCustomTransformers: () => ({
            before: [transformInferno({ classwrap: true })]
          })
        }
      },
      {
        test: /\.ts$/,
        loader: "ts-loader"
      }
    ]
  },
  devServer: {
    contentBase: "src/",
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "body"
    }),
    new CleanWebpackPlugin(["dist"], {
      verbose: true
    }),
    // By default, webpack does `n=>n` compilation with entry files. This concatenates
    // them into a single chunk.
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
