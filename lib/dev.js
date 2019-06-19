const path = require("path");
const webpack = require("webpack");
const chalk = require("chalk");
const ip = require("ip");
const WebpackDevServer = require("webpack-dev-server");
const openBrowser = require("react-dev-utils/openBrowser");
const formatWebpackMessages = require("react-dev-utils/formatWebpackMessages");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const errorOverlayMiddleware = require("react-dev-utils/errorOverlayMiddleware");
const hotDevClientPath = require.resolve("react-dev-utils/webpackHotDevClient");
const SimpleProgressPlugin = require("webpack-simple-progress-plugin");

const CSS_HOT_LOADER = require.resolve("css-hot-loader");

const babelOptions = require("../utils/getBabelOptions");

const dev = args => {
  const cwd = process.cwd();
  const protocol = args.https ? "https" : "http";
  const certFile = args.cert
    ? path.join(cwd, args.cert)
    : path.join(cwd, "cert.pem");
  const keyFile = args.key
    ? path.join(cwd, args.key)
    : path.join(cwd, "cert-key.pem");

  let httpsConfig = null;

  if (protocol === "https") {
    httpsConfig = {
      key: fs.readFileSync(keyFile),
      cert: fs.readFileSync(certFile)
    };
  }

  const webpackConfig = {
    entry: [hotDevClientPath, path.join(cwd, "index.js")],
    output: {
      filename: "bundle.js"
    },
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
          use: [
            CSS_HOT_LOADER,
            { loader: require.resolve("style-loader") },
            {
              loader: require.resolve("css-loader")
            }
          ]
        },
        {
          test: /\.less$/,
          use: [
            { loader: require.resolve("style-loader") },
            {
              loader: require.resolve("css-loader"),
              options: {
                modules: true,
                localIdentName: "[local]___[hash:base64:5]"
              }
            },
            { loader: require.resolve("less-loader") }
          ]
        }
      ]
    },
    plugins: [
      // progress
      new SimpleProgressPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(cwd, "index.html")
      })
    ],
    mode: "development"
  };

  let isFirstCompile = true;
  const compiler = webpack(webpackConfig);

  const devServerConfig = {
    disableHostCheck: true,
    compress: true,
    clientLogLevel: "none",
    hot: true,
    publicPath: "/",
    quiet: true,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 600
    },
    host: args.host,
    port: args.port,
    before(app) {
      // todo add user's before
      // user.before(app);
      app.use(errorOverlayMiddleware());
      app.use((req, res, next) => {
        // set cros for all served files
        res.set("Access-Control-Allow-Origin", "*");
        next();
      });
    }
  };

  if (httpsConfig) {
    devServerConfig.https = httpsConfig;
  }

  const devServer = new WebpackDevServer(compiler, devServerConfig);

  compiler.hooks.done.tap("done", stats => {
    if (isFirstCompile) {
      isFirstCompile = false;
      console.log(chalk.cyan("Starting the development server..."));
      console.log(
        [
          `    - Local:   ${chalk.yellow(
            `${protocol}://${args.host}:${args.port}`
          )}`,
          `    - Network: ${chalk.yellow(
            `${protocol}://${ip.address()}:${args.port}`
          )}`
        ].join("\n")
      );
      openBrowser(`${protocol}://${args.host}:${args.port}`);
    }
    console.log(
      stats.toString({
        colors: true,
        chunks: false,
        assets: true,
        children: false,
        modules: false
      })
    );

    const json = stats.toJson({}, true);
    const messages = formatWebpackMessages(json);
    const isSuccessful = !messages.errors.length && !messages.warnings.length;

    if (isSuccessful) {
      if (stats.stats) {
        console.log(chalk.green("Compiled successfully"));
      } else {
        console.log(
          chalk.green(
            `Compiled successfully in ${(json.time / 1000).toFixed(1)}s!`
          )
        );
      }
    }

    if (messages.errors.length) {
      if (messages.errors.length > 1) {
        messages.errors.length = 1;
      }
      console.log(chalk.red("Failed to compile.\n"));
      console.log(messages.errors.join("\n\n"));
    } else if (messages.warnings.length) {
      console.log(chalk.yellow("Compiled with warnings."));
      console.log();
      messages.warnings.forEach(message => {
        console.log(message);
        console.log();
      });
      // Teach some ESLint tricks.
      console.log("You may use special comments to disable some warnings.");
      console.log(
        `Use ${chalk.yellow(
          "// eslint-disable-next-line"
        )} to ignore the next line.`
      );
      console.log(
        `Use ${chalk.yellow(
          "/* eslint-disable */"
        )} to ignore all warnings in a file.`
      );
    }
  });

  compiler.hooks.invalid.tap("invalid", () => {
    console.log("Compiling...");
  });

  devServer.use((req, res, next) => {
    next();
  });

  devServer.listen(args.port, args.host, err => {
    // 端口被占用，退出程序
    if (err) {
      console.error(err);
      process.exit(500);
    } else {
      // console.log('server started');
    }
  });
};

module.exports = dev;
