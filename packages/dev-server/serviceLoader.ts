import {
  IRequestForwardObjectType
} from './type';

import * as Koa from 'koa';

import { build, send } from './vmLoader';
import { generateCompiler } from './webpackLoader';
import { watch } from './projectWatcher';

import { join } from 'path';

export async function serviceLoader(libType: string = 'koa'): Promise<any> {
  let clientBundleContent: string = '';

  const webpackClientSideFunc = await generateCompiler({
    entry: join(process.cwd(), './__nickelcat_defaultClientLoader.js'),
    target: 'web'
  });
  const webpackServerSideFunc = await generateCompiler({
    entry: join(process.cwd(), './__nickelcat_defaultServerLoader.js'),
    target: 'node'
  });

  watch(async () => {
    clientBundleContent = (await webpackClientSideFunc()).code;
    build(await webpackServerSideFunc());
  });

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
        }
        await next();
      };
    default:
      throw new Error(`Unsupported library type: ${libType}`);
  }
};
