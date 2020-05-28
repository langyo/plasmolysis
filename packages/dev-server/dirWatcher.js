import { watch } from 'chokidar';
import EventEmitter from 'events';

export default ({
  workDirPath,
  aggregate = 1000,
  aggregateAtInitialize = 10000,
  ignored = /(node_modules)|(\.git)/
}) => {
  const emitter = new EventEmitter();

  const fileScan = () => ({});

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
        emitter.emit('update', fileScan());
      }
    }, aggregate);
  };
  setTimeout(() => initlaizeWaitDone = true, aggregateAtInitialize);
  
  watch(workDirPath, {
    ignored
  }).on('all', (event, path) => {
    if (!initlaizeWaitDone) return;
    
    if (delayWaiting) changedDuringDelay = true;
    else delayUpdate();
  });

  return emitter;
};

