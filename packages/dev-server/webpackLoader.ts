import * as webpack from 'webpack';
import * as TerserPlugin from 'terser-webpack-plugin';
import { createConfigItem } from '@babel/core';

import { scan } from './projectWatcher';
import { join } from 'path';

export async function compile(
  webpackConfig: { [key: string]: any }
): Promise<() => Promise<{ code: string, sourceMap: string }>> {
  const fs = await scan();

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
      filename: 'output.js',
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
    devtool: 'source-map',
    ...webpackConfig
  });
  compiler.inputFileSystem = fs;
  compiler.outputFileSystem = fs as any;

  return function compile(): Promise<{ code: string, sourceMap: string }> {
    return new Promise((resolve, reject) => {
      compiler.run((err: Error, status) => {
        if (err) {
          reject(err);
        }

        else if (status.hasErrors()) {
          const info = status.toJson();
          let errStr = '';
          if (status.hasErrors()) {
            info.errors.forEach((e: string) => errStr += (e + '\n'));
          }
          if (status.hasWarnings()) {
            info.warnings.forEach((e: string) => errStr += (e + '\n'));
          }
          reject(new Error(errStr));
        }

        else {
          resolve({
            code: fs.readFileSync('/output.js').toString(),
            sourceMap: fs.readFileSync('/output.js.map').toString()
          });
        }
      })
    });
  }
};
