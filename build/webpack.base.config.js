const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanCSSPlugin = require('less-plugin-clean-css');
const pkg = require('../package.json');

const src = path.resolve(__dirname, '../src');
const postcssoptions = {
  ident: 'postcss',
  sourceMap: true,
  plugins: (loader) => [
    require('postcss-import')(),
    require('postcss-preset-env')({
      stage: 0,
      browsers: [
        'last 2 versions',
        'Safari >= 7',
        'Explorer >= 9',
        'iOS >= 9',
        'Android >= 4'
      ]
    }),
    require('cssnano')({
      reduceIdents: false
    })
  ]
};

module.exports = {
  entry: {
    xbookable: path.resolve(src, 'standalone')
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
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: true
              }
            }, {
              loader: 'postcss-loader',
              options: postcssoptions
            }
          ]
        })
      }, {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: true
            }
          }, {
            loader: 'postcss-loader',
            options: postcssoptions
          }, {
            loader: 'less-loader',
            options: {
              noIeCompat: false,
              sourceMap: true
            }
          }
          ]
        })
      }, {
        test: /\.(jpg|png|gif|svg|webp|woff|woff2|eot|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader'
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
