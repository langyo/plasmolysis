import { parentCreator } from './lib/childProcessCreator';
import middlewareRelay from './middlewareRelay';
import webpackLoader from './webpackLoader';
import projectWatcher from './projectWatcher';

import { serverLog as log } from 'nickelcat/utils/logger';
import { resolve } from 'path';

export default async ({
  workDirPath
}) => {
  const watcher = projectWatcher({ workDirPath });
  let clientBundleContent  = '';

  const webpackClientSide = await webpackLoader({
    entry: resolve(process.cwd(), './__nickelcat_defaultClientLoader.js'),
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

  const webpackServerSide = await webpackLoader({
    entry: resolve(process.cwd(), './__nickelcat_defaultServerLoader.js'),
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
