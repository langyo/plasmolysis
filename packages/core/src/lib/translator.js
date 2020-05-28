import {
  getClientActionTranslator,
  getServerActionTranslator,
  getServerRouterActionTranslator,
  getNativeActionTranslator,
  getNativeRouterActionTranslator
} from './actionLoader';

const dfsFactory = (platform, translator, extraArgs = {}) => (tasks, dfs) => {
  let translated = [], tags = {};
  for (let task of tasks) {
    // Check the head and create special tags at first.
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

    // Combine the normal tasks.
    let translatorRet = translator(task.$$type)(task, extraArgs);
    if (translatorRet) {
      // Translate the special keys before combining.
      translatorRet = translatorRet.map(task => {
        if (task.$$catch) task.$$catch = dfs(task.$$catch, dfs);
        return task;
      });

      translated = [...translated, ...translatorRet];
    }
  }
  return [tags, ...translated];
};

export const clientTranslator = streams => {
  const dfs = dfsFactory('client', getClientActionTranslator);
  let ret = {};

  for (let streamName of Object.keys(streams).filter(key => key[0] !== '$')) {
    if (!Array.isArray(streams[streamName])) continue;
    ret[streamName] = dfs(streams[streamName], dfs);
  }

  ret.$init = streams.$init;
  return ret;
};

export const serverTranslator = stream => {
  const dfs = dfsFactory('server', getServerActionTranslator);

  if (!Array.isArray(stream)) return [];
  else return dfs(stream, dfs);
};

export const serverRouterTranslator = streams => {
  const dfs = dfsFactory('server', getServerRouterActionTranslator, { childStreamTranslator: serverTranslator });
  let ret = {};

  for (let streamName of Object.keys(streams).filter(key => key[0] !== '$')) {
    if (!Array.isArray(streams[streamName])) continue;
    ret[streamName] = dfs(streams[streamName], dfs);
  }

  ret.$preload = streams.$preload;
  return ret;
};

export const nativeTranslator = stream => {
  const dfs = dfsFactory('native', getNativeActionTranslator);

  if (!Array.isArray(stream)) return [];
  else return dfs(stream, dfs);
};

export const nativeRouterTranslator = streams => {
  const dfs = dfsFactory('native', getNativeRouterActionTranslator, { childStreamTranslator: nativeTranslator });
  let ret = {};

  for (let streamName of Object.keys(streams).filter(key => key[0] !== '$')) {
    if (!Array.isArray(streams[streamName])) continue;
    ret[streamName] = dfs(streams[streamName], dfs);
  }

  ret.$preload = streams.$preload;
  return ret;
};
