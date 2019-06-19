process.env.NODE_ENV = "production";

const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const SimpleProgressPlugin = require("webpack-simple-progress-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const babelOptions = require("../utils/getBabelOptions");

module.exports = function(options) {
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
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, require.resolve("css-loader")]
        },
        {
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: require.resolve("css-loader"),
              options: {
                modules: true,
                localIdentName: "[local]___[hash:base64:5]"
              }
            }
          ]
        }
      ]
    },
    plugins: [
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
    ],
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
