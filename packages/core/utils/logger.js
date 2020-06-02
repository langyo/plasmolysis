import chalk from 'chalk';

let isBrowser = typeof window !== 'undefined';

export const clientLog = (...content) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Nickel Cat]', ...content);
  }
};

export const serverLog = (type = 'info', ...context) => {
  let renderType;
  switch (type) {
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

export const generalControllerStreamLog = ({
  tasks, path, payload, status, step, extraErrorInfo
}) => {
  const now = (new Date()).toLocaleTimeString();
  if (isBrowser) {
    console.group(`[Nickel Cat] ${now} ${path} ${status}`);
    console.info('Payload:', payload);
    if (step) {
      console.info('Task type:', tasks[step].$$type);
      console.info(`Step ${step} / ${tasks.length - 1}:`, tasks[step]);
    }
    if (extraErrorInfo) console.error(extraErrorInfo);
    console.groupEnd();
  } else {
    if (step) console.log(`${chalk.yellow(now)} ${chalk.blue('INFO')} ${chalk.magenta('Stream:')} ${step} / ${tasks.length - 1} ${status !== 'fail' ? chalk.green(status) : chalk.red(status)} ${chalk.underline(path)}`);
    else console.log(`${chalk.yellow(now)} ${chalk.blue('INFO')} ${chalk.magenta('Stream:')} ${status !== 'fail' ? chalk.green(status) : chalk.red(status)} ${chalk.underline(path)}`)
    if (extraErrorInfo) console.error(`${chalk.yellow(now)} ${chalk.red('ERROR')}`, extraErrorInfo);
  }
};
