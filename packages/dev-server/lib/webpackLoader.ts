import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';

import { EventEmitter } from 'events';
import scanner from './projectScanner';
import { join } from 'path';

export default async (webpackConfig, updateListener) => {
  const fs = await scanner();
  const emitter = new EventEmitter();

  const compiler = webpack({
    mode: process.env.NODE_ENV || 'development',
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript']
          }
        }
      ]
    },
    resolve: {
      modules: [join(process.cwd(), './node_modules'), 'node_modules']
    },
    output: {
      filename: 'output',
      path: '/'
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          },
        },
        extractComments: false,
        sourceMap: process.env.NODE_ENV === 'development'
      })],
    },
    ...webpackConfig
  });
  compiler.inputFileSystem = fs;
  compiler.outputFileSystem = fs;

  function compile() {
    compiler.run((err: string, status) => {
      if (err) throw new Error(err);

      if (status.hasErrors()) {
        const info = status.toJson();
        if (status.hasErrors()) info.errors.forEach((e: string) => console.error(e));
        if (status.hasWarnings()) info.warnings.forEach((e: string) => console.warn(e));
      }

      emitter.emit('ready', fs.readFileSync('/output').toString());
    });
  }
  compile();

  updateListener.on('update', compile);

  return emitter;
};
