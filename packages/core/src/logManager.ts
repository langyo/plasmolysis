interface ILog {
  time: number,
  level: 'info' | 'debug' | 'warn' | 'error',
  actionType: string,
  entityId: string,
  type: 'enter' | 'leave' | 'crash' | 'debug',
  payload: { [key: string]: any }
};
let logs: ILog[] = [];

export function actionEnterEvent(
  actionType: string, entityId: string,
  payload: { [key: string]: string }
) {
  logs.push({
    time: Date.now(), level: 'info', type: 'enter',
    entityId, actionType, payload
  });
}

export function actionLeaveEvent(
  actionType: string, entityId: string,
  payload: { [key: string]: string }
) {
  logs.push({
    time: Date.now(), level: 'info', type: 'leave',
    entityId, actionType, payload
  });
}

export function actionCrashEvent(
  actionType: string, entityId: string,
  payload: { [key: string]: string }
) {
  logs.push({
    time: Date.now(), level: 'info', type: 'crash',
    entityId, actionType, payload
  });
}

export function getAllLogs(): ILog[] {
  return logs.splice(0, logs.length);
}

let taskTimer: NodeJS.Timeout;

export function registerExportTask(
  duration: number,
  callback: (logs: ILog[]) => Promise<void>,
  reportLevel: 'info' | 'warn' | 'error' = 'info'
) {
  if (typeof taskTimer !== 'undefined') {
    clearTimeout(taskTimer);
  }

  taskTimer = setTimeout(async () => {
    await callback(logs.splice(0, logs.length)
      .filter(({ level }) =>
        reportLevel === 'warn' ? (level === 'warn' || level === 'error') :
          reportLevel === 'error' ? (level === 'error') : true
      )
    );
  }, duration);
}

export function registerCleanTask(duration: number) {
  if (typeof taskTimer !== 'undefined') {
    clearTimeout(taskTimer);
  }

  taskTimer = setTimeout(() => logs.splice(0, logs.length), duration);
}
