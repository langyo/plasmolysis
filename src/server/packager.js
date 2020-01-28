import webpack from 'webpack';
import { resolve } from 'path';
import workDirPath from '../utils/workDirPath';

let listener = webpack({
  entry: resolve('../client/spa/index.js'),
  output: {
    path: resolve(workDirPath, 'dist'),
    filename: 'spa.js'
  }
}).watch({
  aggregateTimeout: 300,
  poll: undefined
}, (err, stats) => {
  if(err) console.error(err);
  else console.log('The bundled file has been updated, hash:', stats.hash)
});

process.on('exit', () => {
  listener.close(() => console.log('Bundler has been closed.'));
});
