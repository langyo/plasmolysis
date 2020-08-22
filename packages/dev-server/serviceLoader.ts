import {
  IRequestForwardObjectType
} from './type';

import * as Koa from 'koa';

import { build, send } from './vmLoader';
import { loader } from './webpackLoader';
import { watch } from './projectWatcher';
import { EventEmitter } from 'events';

import { resolve } from 'path';

export async function serviceLoader(): Promise<(libType: string) => any> {
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

  return new Promise(
    resolve => webpackServerSide.once('ready', async (code: string) => {
      build(code);
      console.log(`The service is ready.`);
      webpackServerSide.on('change', async (code: string) => {
        build(code);
        console.log(`The service has been updated.`);
      });
      resolve((libType: string) => {
        switch (libType) {
          case 'koa':
            return async (ctx: Koa.BaseContext, next: () => Promise<any>) => {
              const { status, code, type, body }: IRequestForwardObjectType =
                await send({
                  ip: ctx.ip,
                  path: ctx.path,
                  query: ctx.query,
                  host: ctx.host,
                  protocol: ctx.protocol,
                  cookies: {
                    // BUG - The type declaration file has not defined 'cookies'
                    get: (ctx as any).cookies.get,
                    set: (ctx as any).cookies.set
                  }
                });

              if (status === 'processed') {
                ctx.type = type;
                ctx.body = body;
                ctx.status = code;
                await next();
              } else {
                await next();
              }
            };
          default:
            throw new Error(`Unsupported library type: ${libType}`);
        }
      });
    }));
};
