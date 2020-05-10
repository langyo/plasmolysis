import {
  getClientActionTranslator,
  getServerActionTranslator,
  getNativeActionTranslator
} from './actionLoader';

const dfsFactory = (platform, translator) => tasks => {
  let translated = [], tags = {};
  for (let task of tasks) {
    if (task === 'loop') {
      if (tags.loop) throw new Error('You has already declared the loop tag!');
      tags.loop = {
        timeOut: 0,
        strictClock: false
      };
      continue;
    }
    if (Array.isArray(task) && task[0] === 'loop') {
      if (tags.loop) throw new Error('You has already declared the loop tag!');
      if (typeof task[1] !== 'object') throw new Error('You must provide an object as the second argument.');
      tags.loop = {
        timeOut: task[1].timeOut || 0,
        strictClock: task[1].strictClock || false
      };
      continue;
    }
    if (typeof task === 'string' && ['client', 'server', 'native'].indexOf(task) >= 0) {
      if (task !== platform) return [];
      else continue;
    }
    if (typeof task === 'function') {
      if (tags.test) throw new Error('You has already declared the test tag!');
      tags.test = task;
      continue;
    }
    translated = [ ...translated, ...translator(task.$$type)(task)];
  }
  return [tags, ...translated];
};

export const clientTranslator = streams => {
  const dfs = dfsFactory('client', getClientActionTranslator);
  let ret = {};

  for (let streamName of Object.keys(streams).filter(key => key[0] !== '$')) {
    if (!Array.isArray(streams[streamName])) continue;
    ret[streamName] = dfs(streams[streamName]);
  }

  ret.$init = streams.$init;
  return ret;
};

export const serverTranslator = streams => {
  const dfs = dfsFactory('server', getServerActionTranslator);
  let ret = {};

  for (let streamName of Object.keys(streams).filter(key => key[0] !== '$')) {
    if (!Array.isArray(streams[streamName])) continue;
    ret[streamName] = dfs(streams[streamName]);
  }

  ret.$preload = streams.$preload;
  return ret;
};

export const nativeTranslator = streams => {
  const dfs = dfsFactory('native', getNativeActionTranslator);
  let ret = {};

  for (let streamName of Object.keys(streams).filter(key => key[0] !== '$')) {
    if (!Array.isArray(streams[streamName])) continue;
    ret[streamName] = dfs(streams[streamName]);
  }

  ret.$preload = streams.$preload;
  return ret;
};
