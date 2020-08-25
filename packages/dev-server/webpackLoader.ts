import * as webpack from 'webpack';
import * as TerserPlugin from 'terser-webpack-plugin';
import { createConfigItem } from '@babel/core';

import { EventEmitter } from 'events';
import { scan } from './projectWatcher';
import { join } from 'path';

export async function loader(
  webpackConfig: { [key: string]: any },
  updateListener: EventEmitter
): Promise<EventEmitter> {
  const fs = await scan();
  const emitter = new EventEmitter();

  const compiler = webpack({
    mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
    context: process.cwd(),
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            presets: [
              createConfigItem(
                require(join(__dirname, './node_modules/@babel/preset-env'))
              ),
              createConfigItem(
                require(join(__dirname, './node_modules/@babel/preset-react'))
              ),
              createConfigItem(
                require(join(__dirname, './node_modules/@babel/preset-typescript'))
              )
            ]
          }
        }
      ]
    },
    resolve: {
      modules: [
        join(__dirname, './node_modules'),
        join(process.cwd(), './node_modules'),
        'node_modules'
      ]
    },
    resolveLoader: {
      modules: [
        join(__dirname, './node_modules'),
        join(process.cwd(), './node_modules'),
        'node_modules'
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
  compiler.inputFileSystem = fs;
  compiler.outputFileSystem = fs as any;

  function compile() {
    compiler.run((err: Error, status) => {
      if (err) {
        throw err;
      }

      if (status.hasErrors()) {
        const info = status.toJson();
        if (status.hasErrors()) {
          info.errors.forEach((e: string) => console.error(e));
        }
        if (status.hasWarnings()) {
          info.warnings.forEach((e: string) => console.warn(e));
        }
      }

      emitter.emit('ready', fs.readFileSync('/output').toString());
    });
  }
  compile();

  updateListener.on('update', compile);

  return emitter;
};
