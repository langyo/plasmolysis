import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';

import { serverLog as log } from '../utils/logger';
import EventEmitter from 'events';
import MFS from 'memory-fs';

export default async (webpackConfig, updateListener) => {
  const fs = new MFS();
  const emitter = new EventEmitter();

  const compiler = webpack({
    mode: process.env.NODE_ENV || 'development',
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        }
      ]
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
  compiler.outputFileSystem = fs;

  compiler.run((err, status) => {
    if (err) throw new Error(err);

    if (status.hasErrors()) {
      const info = status.toJson();
      if (status.hasErrors()) info.errors.forEach(e => log('error', e));
      if (status.hasWarnings()) info.warnings.forEach(e => log('warn', e));
    }

    emitter.emit('ready', fs.readFileSync('/output').toString());
  });

  updateListener.on('update', async () => {
    compiler.run((err, status) => {
      if (err) throw new Error(err);

      if (status.hasErrors()) {
        const info = status.toJson();
        if (status.hasErrors()) info.errors.forEach(e => log('error', e));
        if (status.hasWarnings()) info.warnings.forEach(e => log('warn', e));
      }

      emitter.emit('change', fs.readFileSync('/output').toString());
    });
  });

  return emitter;
};
