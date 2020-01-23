import webpack from 'webpack';
import { resolve } from 'path';

const workDirPath = process.env.WORKDIR;

let listener = webpack({
  entry: resolve('../indexSPA'),
  output: {
    path: resolve(workDirPath, 'dist'),
    filename: 'spa.js'
  }
}).watch({
  aggregateTimeout: 300,
  poll: undefined
}, (err, stats) => {
  if(err) console.error(err);
  else console.log('The SPA bundle file has been updated, hash:', stats.hash)
});

process.on('exit', () => {
  listener.close(() => console.log('The watcher has been closed.'));
});