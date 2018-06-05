const path = require('path');
const fs = require('fs-extra');
const merge = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const base = require('./webpack.base.config.js');

const src = path.resolve(__dirname, '../examples/tags');
const dist = path.resolve(__dirname, '../docs/tags');

// empty output dir
fs.emptyDirSync(dist);

module.exports = merge.strategy({
  entry: 'replace'
})(base, {
  entry: {
    tags: path.resolve(src, 'src/app.js')
  },
  output: {
    path: dist,
    publicPath: '',
    filename: '[name].js'
  },
  devServer: {
    contentBase: [
      dist,
      src
    ],
    //historyApiFallback: true
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'head',
      filename: path.resolve(dist, 'index.html'),
      template: path.resolve(src, 'index.html'),
      showErrors: true
    }),
    new FriendlyErrorsPlugin()
  ]
});
