/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  entry: {
    homepage: path.join(__dirname, "src/views/homepage/index.ts"),
    question: path.join(__dirname, "src/views/question/index.tsx"),

    answerDash: ["core-js", path.join(__dirname, "src/views/answering/index.tsx")]
  },
  output: {
    path: path.join(__dirname, "dist/js"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: ["ts-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    plugins: [
      new TsconfigPathsPlugin()
    ],
    modules: ["node_modules"],
    fallback: {
      "fs": false
    },
  }
};