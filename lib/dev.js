process.env.NODE_ENV = "development";
global.__DEV__ = process.env.NODE_ENV === 'development';

const path = require("path");
const webpack = require("webpack");
const chalk = require("chalk");
const ip = require("ip");
const WebpackDevServer = require("webpack-dev-server");
const openBrowser = require("react-dev-utils/openBrowser");
const formatWebpackMessages = require("react-dev-utils/formatWebpackMessages");
const errorOverlayMiddleware = require("react-dev-utils/errorOverlayMiddleware");
const hotDevClientPath = require.resolve("react-dev-utils/webpackHotDevClient");

const mkcert = require("mkcert");

const babelOptions = require("../utils/getBabelOptions");
const cssLoaders = require("../utils/getCSSLoaders");
const getPlugins = require("../utils/getPlugins");

const dev = async args => {
  const cwd = process.cwd();
  let protocol = args.https ? "https" : "http";

  let httpsConfig = null;

  // 若需要 https 通过 mkcert 自建 CA 后生成一张 CN 为 HOST 的证书
  if (args.https) {
    try {
      console.log("正在创建CA...");
      const { key: caKey, cert: caCert } = await mkcert.createCA({
        organization: "TrustScripts CA",
        countryCode: "CN",
        state: "Shanghai",
        locality: "Shanghai",
        validityDays: 365
      });
      console.log("CA", caKey, caCert);
      // 生成证书
      console.log("正在颁发证书...");
      const { key: CertKey, cert: CertCert } = await mkcert.createCert({
        domains: [args.host],
        validityDays: 365,
        caKey,
        caCert
      });
      console.log("证书", CertKey, CertCert);
      // const certFile = args.cert
      //   ? path.join(cwd, args.cert)
      //   : path.join(cwd, "cert.pem");
      // const keyFile = args.key
      //   ? path.join(cwd, args.key)
      //   : path.join(cwd, "cert-key.pem");
      httpsConfig = {
        key: CertKey,
        cert: CertCert
      };
    } catch (error) {
      console.log(error);
      protocol = "http";
    }
  }

  const webpackConfig = {
    entry: [hotDevClientPath, path.join(cwd, "index.js")], // TODO: 这里暂时写死入口文件为 index.js
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
        ...cssLoaders
      ]
    },
    plugins: getPlugins(),
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
      console.log(chalk.cyan("\nStarting the development server..."));
      console.log(
        [
          `    - Local:   ${chalk.yellow(
            `${protocol}://${args.host}:${args.port}`
          )}`,
          `    - Network: ${chalk.yellow(
            `${protocol}://${ip.address()}:${args.port}`
          )}\n`
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
