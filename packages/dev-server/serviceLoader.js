import { parentCreator } from './childProcessCreator';
import middlewareRelay from './middlewareRelay';
import { loader as webpackLoader } from './webpackLoader';
import dirWatcher from './dirWatcher';

import { serverLog as log } from 'nickelcat/utils/logger';
import { resolve } from 'path';

export default ({
  workDirPath
}) => {
  const watcher = dirWatcher({ workDirPath });
  let clientBundleContent  = '';

  const webpackClientSide = webpackLoader({
    entry: resolve(__dirname, './defaultClientLoader.js'),
    target: 'web'
  }, watcher);
  webpackClientSide.once('ready', content => {
    log('info', `Webpack has been compiled the static file.`);
    clientBundleContent = content;
  });
  webpackClientSide.on('change', content => {
    log('info', `Webpack has been compiled the static file.`);
    clientBundleContent = content;
  });

  const webpackServerSide = webpackLoader({
    entry: resolve(__dirname, './defaultServerLoader.js'),
    target: 'node'
  }, watcher);

  return new Promise(resolveFunc => webpackServerSide.once('ready', content => {
    const { send, restart } = parentCreator(content);
    log('info', `The server has ready.`);
    webpackServerSide.on('change', content => {
      log('info', `Restarting services.`);
      restart(content);
    });
    resolveFunc(middlewareRelay({
      sendFunc: send,
      getClientStaticFile: () => clientBundleContent
    }));
  }));
};
