import { watch } from 'chokidar';
import { EventEmitter } from 'events';

import scanner from './projectScanner';

export default ({
  workDirPath,
  aggregate = 1000,
  aggregateAtInitialize = 10000,
  ignored = /(node_modules)|(\.git)/
}) => {
  const emitter = new EventEmitter();

  let changedDuringDelay = false;
  let delayWaiting = false;
  let initlaizeWaitDone = false;
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
  }).on('all', async (event, path) => {
    if (!initlaizeWaitDone) return;
    await scanner();

    if (delayWaiting) changedDuringDelay = true;
    else delayUpdate();
  });

  return emitter;
};

