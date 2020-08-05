/// <reference path="../type.d.ts" />

export default (send) => (libType: string) => {
  switch (libType) {
    case 'koa':
      return async (ctx, next) => {

        const { hasContentFlag, payload: { type, body, statusCode } } = await send({
          type: 'http',
          payload: {
            ip: ctx.request.ip,
            path: ctx.request.path,
            query: ctx.request.query,
            host: ctx.request.host,
            charset: ctx.request.charset,
            protocol: ctx.request.protocol,
            type: ctx.request.type,
            cookies: ctx.request.cookies,
            body: ctx.request.body
          }
        });

        if (hasContentFlag) {
          ctx.response.type = type;
          ctx.response.body = body;
          ctx.response.status = statusCode;
          await next();
        } else {
          await next();
        }
      };
    default:
      throw new Error(`Unsupported library type: ${libType}`);
  }
}