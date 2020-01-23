import webpack from 'webpack';
import { create } from 'watchr';
import { resolve } from 'path';
import scanDir from 'klaw-sync';

const workDirPath = process.env.WORKDIR;

let pages = scanDir(resolve(workDirPath, 'components/pages')).map(n => n.path).reduce((obj, path) => ({
  ...obj,
  [path.substr(resolve(workDirPath, 'components/pages').length + 1, path.lastIndexOf('.') - resolve(workDirPath, 'components/pages').length - 1).split(/[\///]/).join('.')]: path
}));
let pageWatcher = create(resolve(workDirPath, 'components/pages'), (type, fullPath) => {
  const rootPath = resolve(workDirPath, 'components/pages');
  const path = fullpath.substr(rootPath.length + 1).split(/[\/\\]/).join('.');

  switch (type) {
    case 'create':
      pages[path] = fullPath;
      break;
    case 'delete':
      delete pages[path];
      break;
  }
});
process.on('exit', () => pageWatcher.close());

let listeners = Object.keys(pages).map(path => webpack({
  entry: pages[path],
  output: {
    path: resolve(workDirPath, 'dist'),
    filename: `${path}.js`
  }
}).watch({
  aggregateTimeout: 300,
  poll: undefined
}, (err, stats) => {
  if (err) console.error(err)
  else console.log(stats);
}));

process.on('exit', () => {
  listeners.forEach(e => e.close(() => console.log('The watcher has been closed.')));
});