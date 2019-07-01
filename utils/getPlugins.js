const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const SimpleProgressPlugin = require("webpack-simple-progress-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const cwd = process.cwd();

const devPlugins = () => [
  new SimpleProgressPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new HtmlWebpackPlugin({
    template: path.join(cwd, "index.html")
  })
];

const prodPlugins = args => {
  const plugins = [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    // progress
    new SimpleProgressPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name]_[contenthash:8].css"
    }),
    new HtmlWebpackPlugin({
      template: path.join(cwd, "index.html"),
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false
      }
    })
  ];
  if (args.analyzer) {
    plugins.push(new BundleAnalyzerPlugin());
  }
  return plugins;
};

let plugins = prodPlugins;

if (__DEV__) {
  plugins = devPlugins;
}

module.exports = plugins;
