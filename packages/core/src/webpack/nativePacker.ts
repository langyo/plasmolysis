import { join } from 'path';
import * as webpack from 'webpack';
import { IFs } from 'memfs';
import { Union } from 'unionfs'

const fs: IFs = new Union() as any;
fs['join'] = join;

export async function packNativeSide(entry: string): Promise<string> {
  return new Promise((resolve, _reject) => {
    const compiler = webpack({
      context: process.cwd(),
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
          }
        ]
      },
      resolve: {
        extensions: ['.ts', '.tsx'],
        modules: [
          join(__dirname, '../node_modules'),
          join(process.cwd(), './node_modules'),
          'node_modules'
        ]
      },
      resolveLoader: {
        modules: [
          join(__dirname, '../node_modules'),
          join(process.cwd(), './node_modules'),
          'node_modules'
        ]
      },
      entry,
      mode: 'development',
      target: 'node',
      output: {
        filename: '__bundle.js',
        path: __dirname
      },
      cache: {
        type: 'memory'
      },
      devtool: 'inline-source-map'
    });
    compiler.inputFileSystem = fs;
    compiler.outputFileSystem = fs;

    compiler.run((err: Error, stats) => {
      if (err) {
        console.error(err);
      } else if (stats.hasErrors()) {
        const info = stats.toJson();
        let errStr = '';
        if (stats.hasErrors()) {
          for (const e of info.errors) {
            errStr += `${e.message}\n`;
          }
        }
        if (stats.hasWarnings()) {
          for (const e of info.warnings) {
            errStr += `${e.message}\n`;
          }
        }
        console.error(Error(errStr));
      } else {
        resolve(fs.readFileSync(join(
          __dirname, './__bundle.js'
        ), 'utf8') as string);
      }
    });
  });
}
