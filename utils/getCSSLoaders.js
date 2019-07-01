const CSS_HOT_LOADER = require.resolve("css-hot-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const CSSLoaders = [
  {
    test: /\.css$/,
    use: cssUse()
  },
  {
    test: /\.less$/,
    use: lessUse()
  }
];

function cssUse() {
  if (__DEV__) {
    return [
      CSS_HOT_LOADER,
      { loader: require.resolve("style-loader") },
      {
        loader: require.resolve("css-loader")
      }
    ];
  }
  return [MiniCssExtractPlugin.loader, require.resolve("css-loader")];
}

function lessUse() {
  if (__DEV__) {
    return [
      { loader: require.resolve("style-loader") },
      {
        loader: require.resolve("css-loader"),
        options: {
          modules: true,
          localIdentName: "[local]___[hash:base64:5]"
        }
      },
      { loader: require.resolve("less-loader") }
    ];
  }
  return [
    MiniCssExtractPlugin.loader,
    {
      loader: require.resolve("css-loader"),
      options: {
        modules: true,
        localIdentName: "[local]___[hash:base64:5]"
      }
    }
  ];
}

module.exports = CSSLoaders;
