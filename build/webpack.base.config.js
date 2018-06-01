const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanCSSPlugin = require('less-plugin-clean-css');
const pkg = require('../package.json');

const src = path.resolve(__dirname, '../src');

module.exports = {
  entry: {
    xbookable: src
  },
  node: {
    __dirname: true,
    __filename: true,
    dns: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  externals: {
    'angular': 'angular',
    'jquery': 'jQuery'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          sourceMap: true,
        },
        exclude: /node_modules/
      }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        })
      }, {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                sourceMap: true,
              }
            },  {
              loader: 'less-loader',
              options: {
                sourceMap: true,
                plugins: [
                  new CleanCSSPlugin({
                    advanced: true,
                    compatibility: '*'
                  })
                ]
              }
            }, {
              loader: 'autoprefixer-loader'
            }
          ]
        })
      }, {
        test: /\.(jpg|png|woff|woff2|gif|eot|ttf|svg)\??.*$/,
        loader: 'url-loader?limit=16384'
      }, {
        test: /\.(html|tpl)$/,
        loader: 'html-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.less'],
    mainFields: ['browser', 'main']
  },
  plugins: [
    new ExtractTextPlugin({
      allChunks: true,
      filename: '[name].css'
    }),
    new webpack.DefinePlugin({
      'process.env.VERSION': JSON.stringify(pkg.version)
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
};
