import Koa from 'koa';
import routerMiddleware from 'koa-router';
import bodyParserMiddleware from 'koa-bodyparser';

const app = new Koa();

app.use(bodyParserMiddleware());

const router = routerMiddleware();

app.use(async (ctx, next) => {
  const now = (new Date()).toLocaleTimeString();

  console.log(`[${now}][${ctx.request.method}] ${ctx.request.ip}: Hit ${ctx.request.url}`);
  await next();
});

router.get('/', async (ctx, next) => {
  ctx.response.type = 'text/html';
  ctx.response.body = '<h1>Test page</h1>';
});

app.use(router.routes());

app.listen(3000);
console.log('Server has been running at the port 3000.');
