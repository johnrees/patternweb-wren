const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    app: './index.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './dist/js/'),
    publicPath: '/js/'
  },
  devServer: {
    contentBase: path.resolve(__dirname, './public')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            plugins: ['transform-runtime', 'transform-regenerator']
          }
        }
      }
    ]
  },
  node: {
    fs: "empty"
  }
}
