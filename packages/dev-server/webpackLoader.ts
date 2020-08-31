import * as webpack from 'webpack';
import * as TerserPlugin from 'terser-webpack-plugin';
import { createConfigItem } from '@babel/core';

import { join } from 'path';

import { Volume } from 'memfs';
import { Union } from 'unionfs'
import * as realFs from 'fs';

export async function generateCompiler(
  webpackConfig: { [key: string]: any },
  parseFilterComponents: string[]
    = ['', 'dialog.', 'dialogs.', 'page.', 'pages.', 'view.', 'views.']
): Promise<() => Promise<{ code: string, sourceMap: string }>> {
  return async function (): Promise<{ code: string, sourceMap: string }> {
    let components: {
      name: string,
      path: string
    }[] = [];
    let configPath: string = '';

    const scanDfs = (path: string, route: string = '') => {
      let list: {
        fileName: string,
        path: string,
        route: string
      }[] = [];
      for (const fileName of realFs.readdirSync(path)) {
        if (realFs.statSync(join(path, fileName)).isDirectory()) {
          list = list.concat(
            scanDfs(join(path, fileName), `${route}${fileName}.`)
          );
        }
        else if (/(\.js)|(\.mjs)|(\.ts)|(\.jsx)|(\.tsx)$/.test(fileName)) {
          list.push({
            fileName: `${route}${fileName.slice(0, fileName.lastIndexOf('.'))}`,
            path: join(path, fileName),
            route
          });
        }
      }
      return list;
    }

    if (
      realFs.existsSync(join(process.cwd(), './src')) &&
      realFs.statSync(join(process.cwd(), './src')).isDirectory()
    ) {
      for (const component of scanDfs(join(process.cwd(), './src'))) {
        if (parseFilterComponents.indexOf(component.route) >= 0) {
          components.push({
            name: component.fileName,
            path: component.path.split('\\').join('\\\\')
          });
          break;
        }
      }
    }

    configPath =
      realFs.existsSync(
        join(process.cwd(), './nickelcat.config.ts')
      ) && join(process.cwd(), './nickelcat.config.ts') ||
      realFs.existsSync(
        join(process.cwd(), './nickelcat.config.js')
      ) && join(process.cwd(), './nickelcat.config.js');

    const virtualFiles = {
      [join(__dirname, './__nickelcat_staticRequire.js')]: `
  module.exports = ${
        JSON.stringify({
          webClient: {
            ...components.reduce((obj, { name, path }) => ({
              ...obj,
              [name]: {
                component: `require("${
                  path.split('\\').join('\\\\')
                  }").default`,
                controller: `require("${
                  path.split('\\').join('\\\\')
                  }").controller`
              }
            }), {})
          },
          nodeServer: {
            // TODO - Upgrade the structure.
          }
        })};`,
      [join(process.cwd(), './__nickelcat_defaultClientLoader.js')]:
        `require("${
        join(__dirname, './defaultClientLoader.js').split('\\').join('\\\\')
        }")`,
      [join(process.cwd(), './__nickelcat_defaultServerLoader.js')]:
        `require("${
        join(__dirname, './defaultServerLoader.js').split('\\').join('\\\\')
        }")`
    };

    const mfs = Volume.fromJSON(virtualFiles);
    let fs = (new Union()).use(realFs).use(mfs as any);
    if (typeof fs['join'] === 'undefined') {
      fs['join'] = join;
    }

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
          sourceMap: true
        })],
      },
      devtool: 'source-map',
      ...webpackConfig
    });
    compiler.inputFileSystem = fs;
    compiler.outputFileSystem = fs as any;

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
          fs.readFile('/output.js', { encoding: 'utf8' },
            (err, code) => {
              fs.readFile('/output.js.map', { encoding: 'utf8' },
                (err, sourceMap) => {
                  resolve({
                    code, sourceMap
                  })
                })
            });
        }
      })
    });
  }
};
