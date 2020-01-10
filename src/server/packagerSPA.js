import webpack from 'webpack';
import { workDirPath } from '../staticRequire';
import { resolve } from 'path';

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
  if(err) console.error(err)
  else console.log(stats);
});

process.on('exit', () => {
  listener.close(() => console.log('The watcher has been closed.'));
});