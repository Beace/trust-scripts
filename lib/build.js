process.env.NODE_ENV = "production";
global.__DEV__ = process.env.NODE_ENV === 'development';

const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const babelOptions = require("../utils/getBabelOptions");
const cssLoaders = require("../utils/getCSSLoaders");
const getPlugins = require("../utils/getPlugins");

module.exports = function(args) {
  const cwd = process.cwd();
  const webpackConfig = {
    entry: path.join(cwd, "index.js"),
    output: {
      filename: "[name]_[chunkhash:8].js",
      path: path.join(cwd, "dist")
    },
    mode: "production",
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: require.resolve("babel-loader"),
          options: babelOptions
        },
        ...cssLoaders
      ]
    },
    plugins: getPlugins(args),
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all"
          }
        }
      },
      // 压缩 CSS 文件
      minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})]
    }
  };

  const compiler = webpack(webpackConfig);
  compiler.run((error, stats) => {
    if (error) {
      throw error;
    } else {
      console.log(
        stats.toString({
          colors: true,
          chunks: false,
          children: false,
          modules: false,
          chunkModules: false
        })
      );

      if (stats.hasErrors()) {
        throw new Error("oops..., webpack compiled failed.");
      }

      if (stats.hasWarnings()) {
        console.warn(stats.toJson());
      }
    }
  });
};
