type IEventType =
  'actionEnter' | 'actionLeave' | 'actionCrash' |
  'info' | 'warn' | 'error' |
  'runtimeInstall' | 'runtimeUninstall';
type ICallback = (log: ILog) => any;

export interface ILog {
  time: number,
  path: string,
  eventType: IEventType,
  extraInfo: string
};

let logs: ILog[] = [];
let callbackFunc: ICallback[] = [];

function runCallback(log: ILog) {
  for (const func of callbackFunc) {
    func(log);
  }
}

export function registerCallback(cb: ICallback) {
  callbackFunc.push(cb);
}

export function log(
  level: 'info' | 'warn' | 'error',
  ...args: string[]
) {
  const log: ILog = {
    time: Date.now(),
    eventType: level,
    path: '',
    extraInfo: args.join(' ')
  };
  logs.push(log);
  runCallback(log);
}

export function eventLog(
  eventType: IEventType,
  path: string,
  extraInfo: string
) {
  const log: ILog = {
    time: Date.now(),
    eventType,
    path,
    extraInfo
  }
  logs.push(log);
  runCallback(log);
}


export function getLogs(): ILog[] {
  return logs.splice(0, logs.length);
}
