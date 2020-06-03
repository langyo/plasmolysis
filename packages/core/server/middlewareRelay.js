import { serverLog as log } from '../utils/logger';

export default ({
  sendFunc,
  libType = 'koa',
  staticClientPath = './spa.js'
}) => {
  if (typeof sendFunc !== 'function') throw new Error('You must provide a function to exchange the data between two models.');

  switch (libType) {
    case 'koa':
      return async (ctx, next) => {
        const { successFlag, payload: { type, body } } = await sendFunc({
          type: 'http',
          payload: {
            ip: ctx.request.ip,
            path: ctx.request.path,
            query: ctx.request.query,
            host: ctx.request.host,
            charset: ctx.request.charset,
            protocol: ctx.request.protocol,
            type: ctx.request.type,
            cookies: ctx.request.cookies
          },
          configs: {
            staticClientPath
          }
        });

        if (successFlag) {
          ctx.response.type = type;
          ctx.response.body = body;
          await next();
        } else {
          await next();
        }
      };
    default:
      throw new Error(`Unsupported library type: ${libType}`);
  }
}