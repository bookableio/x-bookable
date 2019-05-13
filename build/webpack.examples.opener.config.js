const path = require('path');
const fs = require('fs-extra');
const merge = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const base = require('./webpack.base.config.js');

const src = path.resolve(__dirname, '../src');
const docbase = path.resolve(__dirname, '../examples/opener');
const dist = path.resolve(__dirname, '../docs/opener');

// empty output dir
fs.emptyDirSync(dist);

module.exports = merge.strategy({
  entry: 'replace'
})(base, {
  entry: {
    opener: path.resolve(src, 'opener.js')
  },
  output: {
    path: dist,
    publicPath: '',
    filename: '[name].js',
    library: 'xbookable',
    libraryTarget: 'umd',
    libraryExport: "default"
  },
  devServer: {
    contentBase: [
      dist,
      docbase
    ],
    //historyApiFallback: true
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'head',
      filename: path.resolve(dist, 'index.html'),
      template: path.resolve(docbase, 'index.html'),
      showErrors: true
    }),
    new FriendlyErrorsPlugin()
  ]
});
