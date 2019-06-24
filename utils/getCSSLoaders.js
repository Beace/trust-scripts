const CSS_HOT_LOADER = require.resolve("css-hot-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const isDEV = process.env.NODE === "development";

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
  if (isDEV) {
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
  if (isDEV) {
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
