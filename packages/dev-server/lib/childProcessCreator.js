import EventEmitter from 'events';
import { fork } from 'child_process';
import { generate } from 'shortid';
import { resolve } from 'path';

export const parentCreator = async content => {
  let childProcess = fork(resolve(__dirname, './childProcessShell.js'), { slient: true });
  let emitter = new EventEmitter();

  const watch = content => new Promise(resolve => {
    childProcess.on('message', ({ payload, id, type }) => {
      if (type === 'normal') {
        emitter.emit('message', { payload, id })
      } else if (type === 'init') {
        emitter.emit('init');
        resolve();
      }
    });
    process.on('exit', () => childProcess.kill());
    childProcess.send({ type: 'init', payload: content });
  });
  await watch(content);

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
    restart: () => new Promise(respond => {
      const fn = () => {
        emitter.off('init', fn);
      };
      emitter.once('init', fn);
      childProcess.kill();
      childProcess = fork(resolve(__dirname, './childProcessShell.js'));
      watch(content).then(respond);
    })
  };
};

export const childCreator = processor => {
  global._nickelcat_loadProcessor = processor;
};
