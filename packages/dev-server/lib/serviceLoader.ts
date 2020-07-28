import vmLoader from './vmLoader';
import middlewareRelay from './middlewareRelay';
import webpackLoader from './webpackLoader';
import projectWatcher from './projectWatcher';
import { EventEmitter } from 'events';

import { resolve } from 'path';

export default async (workDirPath: string = process.cwd()) => {
  const watcher = projectWatcher({
    workDirPath,
    aggregate: 1000,
    aggregateAtInitialize: 5000,
    ignored: /(node_modules)|(\.git)/
  });
  let clientBundleContent: string = '';

  const webpackClientSide: EventEmitter = await webpackLoader({
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

  const webpackServerSide: EventEmitter = await webpackLoader({
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
