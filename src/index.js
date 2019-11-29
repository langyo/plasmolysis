import { join } from 'path';
import express from 'express';
import compression from 'compression';
import next from 'next';
import helmet from 'helmet';
import { configure, connectLogger, getLogger, levels } from 'log4js';
import { json } from 'body-parser';

const port = parseInt(process.env.PORT, 10) || 80;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

import services from './services';

import { resolve } from 'path';
import { readdirSync, statSync } from 'fs';

const config = require(resolve('./configs/config'));

const fileReadDir = name => {
  let files = readdirSync(name);
  let ret = [];
  for (let file of files) {
    if (statSync(`${name}/${file}`).isDirectory())
      ret.concat(fileReadDir(`${name}/${file}`));
    else ret.push(/(.+)\.js$/.exec(file)[1]);
  }
  return ret;
};

const pages = fileReadDir(resolve('./components/pages'));
console.log(pages)

app.prepare().then(() => {
  const server = express();

  server.use(helmet());
  server.use(compression());

  console.log('Now it is in the', dev ? 'development' : 'production', 'mode.');
  if(!dev) {
    configure({
      appenders: {
        out: { type: 'stdout' },
        app: { type: 'file', filename: +(new Date()) + '.log' }
      },
      categories: {
        default: { appenders: ['out', 'app'], level: 'debug' }
      }
    });
    server.use(connectLogger(getLogger('normal'), { level: levels.INFO }));
  }

  server.use('/static', express.static(join(__dirname, '../public'), {
    maxAge: '1d',
    immutable: true
  }));

  server.use(json());

  services(server);

  server.get('/', (req, res) => app.render(req, res, `/index`, req.query));
  server.get('/index', (req, res) => app.render(req, res, `/index`, req.query));

  for(let name of pages) {
    server.get(`/${name}`, (req, res) => app.render(req, res, `/index`, req.query));
  }

  server.get('*', (req, res) => {
    return handle(req, res)
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  });
});
