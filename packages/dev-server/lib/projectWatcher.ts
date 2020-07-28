import { watch } from 'chokidar';
import { EventEmitter } from 'events';

import scanner from './projectScanner';

interface IOptions {
  workDirPath: string,
  aggregate: number,
  aggregateAtInitialize: number,
  ignored: RegExp
};

export default ({
  workDirPath,
  aggregate,
  aggregateAtInitialize,
  ignored
}: IOptions): EventEmitter => {
  const emitter: EventEmitter = new EventEmitter();

  let changedDuringDelay: boolean = false;
  let delayWaiting: boolean = false;
  let initlaizeWaitDone: boolean = false;
  const delayUpdate = () => {
    delayWaiting = true;
    setTimeout(() => {
      if (changedDuringDelay) {
        changedDuringDelay = false;
        delayUpdate();
      } else {
        delayWaiting = false;
        emitter.emit('update');
      }
    }, aggregate);
  };
  setTimeout(() => initlaizeWaitDone = true, aggregateAtInitialize);

  watch(workDirPath, {
    ignored
  }).on('all', async () => {
    if (!initlaizeWaitDone) return;
    await scanner();

    if (delayWaiting) changedDuringDelay = true;
    else delayUpdate();
  });

  return emitter;
};

