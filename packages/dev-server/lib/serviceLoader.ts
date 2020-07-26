import vmLoader from './vmLoader';
import middlewareRelay from './middlewareRelay';
import webpackLoader from './webpackLoader';
import projectWatcher from './projectWatcher';

import { resolve } from 'path';

export default async ({
  workDirPath
}) => {
  const watcher = projectWatcher({ workDirPath });
  let clientBundleContent = '';

  const webpackClientSide = await webpackLoader({
    entry: resolve(process.cwd(), './__nickelcat_defaultClientLoader.js'),
    target: 'web'
  }, watcher);
  webpackClientSide.once('ready', (content: string) => {
    console.log(`The static render file is ready.`);
    clientBundleContent = content;
  });
  webpackClientSide.on('change', (content: string) => {
    console.log('info', `The static render file has been updated.`);
    clientBundleContent = content;
  });

  const webpackServerSide = await webpackLoader({
    entry: resolve(process.cwd(), './__nickelcat_defaultServerLoader.js'),
    target: 'node'
  }, watcher);

  return new Promise(resolveFunc => webpackServerSide.once('ready', async content => {
    const { send, restart } = await vmLoader(content);
    console.log(`The service is ready.`);
    webpackServerSide.on('change', async content => {
      restart(content);
      console.log(`The service has been updated.`);
    });
    resolveFunc(middlewareRelay({
      sendFunc: send,
      getClientStaticFile: () => clientBundleContent
    }));
  }));
};
