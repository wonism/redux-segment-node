const webpack = require('webpack');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

const developmentPlugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
];

const productionPlugins = [
  new CompressionPlugin(),
];

const plugins = [
  new webpack.DefinePlugin({
    process: {
      env: {
        NODE_ENV: JSON.stringify(isProduction ? 'production' : 'development'),
      },
    },
  }),
].concat(isProduction ?
  productionPlugins :
  developmentPlugins
);

const optimization = isProduction ? {
  minimizer: [
    new UglifyWebpackPlugin({
      sourceMap: false,
      extractComments: {
        banner: false
      },
    }),
  ],
} : {};

const config = {
  mode: isProduction ? 'production' : 'development',
  entry: path.resolve(__dirname, isProduction ? 'src' : 'demo', 'index.js'),
  optimization,
  output: {
    filename: 'redux-segment-platform.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'demo'),
    publicPath: '/',
    inline: true,
    hot: true,
    host: '0.0.0.0',
    port: 7777,
    historyApiFallback: true,
  },
  resolve: {
    extensions: ['.js'],
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src'),
    ],
  },
  plugins,
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.js$/,
      loader: 'eslint-loader',
      include: path.resolve('./src'),
      options: {
        failOnWarning: true,
        failOnError: true,
        emitWarning: true,
      },
    }, {
      test: /\.js$/,
      use: 'babel-loader',
      exclude: /node_modules|bower_components/,
    }],
  },
  externals: {},
  devtool: isProduction ? false : 'eval-source-map',
};

module.exports = config;
