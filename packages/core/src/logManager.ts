interface ILog {
  time: number,
  level: 'info' | 'debug' | 'warn' | 'error',
  actionType: string,
  entityId: string,
  type: 'enter' | 'leave' | 'crash' | 'debug',
  payload: { [key: string]: any }
};
let logs: ILog[] = [];

let timeoutObjStorage: NodeJS.Timeout;
let threshold: number = 0;
let exportCallbackFunc: (logs: ILog[]) => Promise<void>;

function exportCallback() {
  exportCallbackFunc(logs.splice(0, logs.length));
}

function checkThreshold() {
  if (threshold > 0 && logs.length >= threshold) {
    exportCallback();
  }
}

export function actionEnterEvent(
  actionType: string, entityId: string,
  payload: { [key: string]: string }
) {
  logs.push({
    time: Date.now(), level: 'info', type: 'enter',
    entityId, actionType, payload
  });
  checkThreshold();
}

export function actionLeaveEvent(
  actionType: string, entityId: string,
  payload: { [key: string]: string }
) {
  logs.push({
    time: Date.now(), level: 'info', type: 'leave',
    entityId, actionType, payload
  });
  checkThreshold();
}

export function actionCrashEvent(
  actionType: string, entityId: string,
  payload: { [key: string]: string }
) {
  logs.push({
    time: Date.now(), level: 'info', type: 'crash',
    entityId, actionType, payload
  });
  checkThreshold();
}

export function getAllLogs(): ILog[] {
  return logs.splice(0, logs.length);
}

export function registerExportTask(
  callback: (logs: ILog[]) => Promise<void>,
  reportLevel: 'info' | 'warn' | 'error' = 'info',
  { duration, maxCount }: { duration?: number, maxCount?: number }
) {
  if (typeof timeoutObjStorage !== 'undefined') {
    clearTimeout(timeoutObjStorage);
  }
  exportCallbackFunc = async () => {
    await callback(logs.splice(0, logs.length)
      .filter(({ level }) =>
        reportLevel === 'warn' ? (level === 'warn' || level === 'error') :
          reportLevel === 'error' ? (level === 'error') : true
      )
    );
  };

  if (typeof duration === 'number' && duration > 0) {
    // Timing.
    timeoutObjStorage = setTimeout(() => exportCallback(), duration);
  }
  if (typeof maxCount === 'number' && maxCount > 0) {
    // Setting thresholds.
    threshold = maxCount;
  }
}

export function registerCleanTask(duration: number) {
  if (typeof timeoutObjStorage !== 'undefined') {
    clearTimeout(timeoutObjStorage);
  }

  timeoutObjStorage = setTimeout(() => logs.splice(0, logs.length), duration);
}
