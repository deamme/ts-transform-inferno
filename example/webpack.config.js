var path = require("path");
var transformer = require("ts-transform-inferno").default;

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist/"),
    filename: "bundle.js"
  },
  resolve: {
    extensions: [".ts", ".tsx"]
  },
  module: {
    rules: [
      {
        test: /\.tsx$/,
        loader: "ts-loader",
        options: {
          getCustomTransformers: () => ({
            before: [transformer()]
          })
        }
      },
      {
        test: /\.ts$/,
        loader: "ts-loader"
      }
    ]
  }
};
