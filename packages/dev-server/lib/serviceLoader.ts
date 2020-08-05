import { build, send } from './vmLoader';
import middlewareRelay from './middlewareRelay';
import { loader } from './webpackLoader';
import { watch } from './projectWatcher';
import { EventEmitter } from 'events';

import { resolve } from 'path';

export default async function () {
  const watcher = watch();
  let clientBundleContent: string = '';

  const webpackClientSide: EventEmitter = await loader({
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

  const webpackServerSide: EventEmitter = await loader({
    entry: resolve(process.cwd(), './__nickelcat_defaultServerLoader.js'),
    target: 'node'
  }, watcher);

  return new Promise(resolve => webpackServerSide.once('ready', async (code: string) => {
    build(code);
    console.log(`The service is ready.`);
    webpackServerSide.on('change', async (code: string) => {
      build(code)
      console.log(`The service has been updated.`);
    });
    resolve(middlewareRelay(send));
  }));
};
