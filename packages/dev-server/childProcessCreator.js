import EventEmitter from 'events';
import { fork } from 'child_process';
import { generate } from 'shortid';
import { resolve } from 'path';

export const parentCreator = content => {
  let childProcess = fork(resolve(__dirname, './childProcessShell.js'));
  let emitter = new EventEmitter();


  const watch = content => {
    childProcess.on('message', ({ payload, id, type }) => {
      if (type === 'normal') {
        emitter.emit('message', { payload, id })
      } else if (type === 'init') {
        emitter.emit('init');
      }
    });
    process.on('exit', () => childProcess.kill());
    childProcess.send({ type: 'init', payload: content });
  };
  watch(content);

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
        childProcess.send({ type: 'normal', payload, id: myId });
      });
    },
    restart: () => {
      childProcess.kill();
      const fn = () => {
        emitter.off('init', fn);
      };
      emitter.once('init', fn);
      childProcess = fork(resolve(__dirname, './childProcessShell.js'));
      watch(content);
    }
  };
};

export const childCreator = processor => {
  global._nickelcat_loadProcessor = processor;
};
