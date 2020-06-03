import webpack from 'webpack';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';

import { serverLog as log } from '../utils/logger';
import { resolve } from 'path';
import EventEmitter from 'events';

import { mkdirSync } from 'fs';

export default ({ webpackConfig, defaultDirPath }) => {
  // Check the temporary folder, and create the folder if it's not exist.
  mkdirSync(resolve(defaultDirPath), { recursive: true });

  const emitter = new EventEmitter();
  let hasBuilt = false;

  webpack({
    mode: process.env.NODE_ENV || 'development',
    watch: true,
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: '/node_modules/'
        }
      ]
    },
    ...webpackConfig
  }, (err, status) => {
    if (err) throw new Error(err);

    if (status.hasErrors()) {
      const info = status.toJson();
      if (status.hasErrors()) info.errors.forEach(e => log('error', e));
      if (status.hasWarnings()) info.warnings.forEach(e => log('warn', e));
    }
    
    if (hasBuilt) {
      emitter.emit('change');
    } else {
      hasBuilt = true;
      emitter.emit('ready');
    }
  });

  return emitter;
}
