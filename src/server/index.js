import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import { configure, connectLogger, getLogger, levels } from 'log4js';
import { json } from 'body-parser';

import ReactDom from 'react-dom';
import { resolve } from 'path';

const port = parseInt(process.env.PORT, 10) || 80;
const dev = process.env.NODE_ENV !== 'production';

import services from './services';
import { workDirPath, fileEmitter } from '../utils/require';

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

  server.use('/static', express.static(resolve(workDirPath, 'static'), {
    maxAge: '1t',
    immutable: true
  }));

  server.use(json());

  // services(server);

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  });
});
