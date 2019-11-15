const path = require('path');
const express = require('express');
const compression = require('compression');
const next = require('next');
const helmet = require('helmet');
const log4js = require('log4js');
const bodyParser = require('body-parser');

const port = parseInt(process.env.PORT, 10) || 80;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const services = require('./services');

app.prepare().then(() => {
  const server = express();

  server.use(helmet());
  server.use(compression());

  console.log('Now it is in the', dev ? 'development' : 'production', 'mode.');
  if(!dev) {
    log4js.configure({
      appenders: {
        out: { type: 'stdout' },
        app: { type: 'file', filename: +(new Date()) + '.log' }
      },
      categories: {
        default: { appenders: ['out', 'app'], level: 'debug' }
      }
    });
    server.use(log4js.connectLogger(log4js.getLogger('normal'), { level: log4js.levels.INFO }));
  }

  server.use('/static', express.static(path.join(__dirname, '../public'), {
    maxAge: '1d',
    immutable: true
  }));

  server.use(bodyParser.json());

  services(server);

  server.get('/', (req, res) => {
    return app.render(req, res, '/index', req.query)
  });

  server.get('/index', (req, res) => {
    return app.render(req, res, '/index', req.query)
  });

  server.get('*', (req, res) => {
    return handle(req, res)
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  });
});
