const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path')

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  externals: slsw.lib.webpack.isLocal ? [nodeExternals()] : ['aws-sdk'],
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.mjs', '.tsx', '.ts', '.js', '.jsx'],
    alias:{
      'src': path.resolve(__dirname, './src'),
    }
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "src",
          to: "src",
          globOptions:{
            ignore:['**/*.js','**/*.ts']
          }
        },
      ],
    }),
  ],
};
