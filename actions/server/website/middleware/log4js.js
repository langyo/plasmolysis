import log4js from 'log4js';

log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    app: { type: 'file', filename: +(new Date()) + '.log' }
  },
  categories: {
    default: { appenders: ['out', 'app'], level: 'debug' }
  }
});

const logger = log4js.getLogger('normal');

export default server => server.use(
  log4js.connectLogger(logger, { level: log4js.levels.INFO })
);
