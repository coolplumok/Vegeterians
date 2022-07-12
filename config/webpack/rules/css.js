const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  test: /\.s?css$/i,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
        importLoaders: 1,
        modules: true,
        localIdentName: '[hash:base64:5]',
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
      },
    },
  ],
};