import chalk from 'chalk';

export const clientLog = (...content) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Nickel Cat]', ...content);
  }
};

export const serverLog = (type = 'info', ...context) => {
  let renderType;
  switch(type) {
    case 'info':
      renderType = chalk.blue('INFO');
      break;
    case 'warn':
      renderType = chalk.bgYellow.black('WARN');
      break;
    case 'error':
      renderType = chalk.red('ERROR');
      break;
    case 'debug':
      renderType = chalk.bgBlue.black('DEBUG');
      break;
    default:
      throw new Error(`Unknown log type: ${type}`);
  }

  const now = (new Date()).toLocaleTimeString();
  console.log(`${chalk.yellow(now)} ${renderType}`, ...context);
};
