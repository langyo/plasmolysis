import EventEmitter from 'events';
import { fork } from 'child_process';
import { generate } from 'shortid';

export const parentCreator = link => {
  let childProcess = fork(link);
  let emitter = new EventEmitter();


  const watch = () => {
    childProcess.on('message', ({ payload, id, type }) => {
      if (type === 'normal') {
        emitter.emit('message', { payload, id })
      } else if (type === 'init') {
        emitter.emit('init');
      }
    });
    process.on('exit', () => childProcess.kill());
  };
  watch();

  return {
    send: async payload => {
      return await new Promise(resolve => {
        const myId = generate();
        const fn = ({ payload, id }) => {
          if (myId === id) {
            resolve(payload);
            emitter.off('message', fn);
          }
        };
        emitter.on('message', fn);
        childProcess.send({ payload, id: myId, type: 'normal' });
      });
    },
    restart: () => {
      childProcess.kill();
      const fn = () => {
        emitter.off('init', fn);
      };
      emitter.once('init', fn);
      childProcess = fork(link);
      watch();
      childProcess.send({ type: 'init' });
    }
  };
};

export const childCreator = processor =>
  process.on('message', ({ payload, id, type }) => {
    if (type === 'normal') {
      processor(payload).then(payload => process.send({
        payload, id, type
      }));
    } else if (type === 'init') {
      process.send({ type });
    }
  });
