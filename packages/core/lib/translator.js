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
    
    // If the task is an empty object, skip it.
    if (Object.keys(task).length === 0) continue;

    // Combine the normal tasks.
    if (!translator(task.$$type)) throw new Error(`Unknown task type "${task.$$type}".`);
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

export const clientTranslator = (stream, actionManager) => {
  const dfs = dfsFactory('client', actionManager.getClientActionTranslator);
  let ret = {};

  for (let streamName of Object.keys(stream).filter(key => key[0] !== '$')) {
    if (!Array.isArray(stream[streamName])) continue;
    ret[streamName] = dfs(stream[streamName], dfs);
  }

  ret.$init = stream.$init;
  return ret;
};

export const serverTranslator = (stream, actionManager) => {
  const dfs = dfsFactory('server', actionManager.getServerActionTranslator);

  if (!Array.isArray(stream)) return [];
  else return dfs(stream, dfs);
};

export const serverRouterTranslator = (stream, actionManager) => {
  const dfs = dfsFactory('server', actionManager.getServerRouterActionTranslator, { childStreamTranslator: stream => serverTranslator(stream, actionManager) });
  let ret = {};

  for (let streamName of Object.keys(stream).filter(key => key[0] !== '$')) {
    if (!Array.isArray(stream[streamName])) continue;
    ret[streamName] = dfs(stream[streamName], dfs);
  }

  ret.$preload = stream.$preload;
  return ret;
};

export const nativeTranslator = (stream, actionManager) => {
  const dfs = dfsFactory('native', actionManager.getNativeActionTranslator);

  if (!Array.isArray(stream)) return [];
  else return dfs(stream, dfs);
};

export const nativeRouterTranslator = (stream, actionManager) => {
  const dfs = dfsFactory('native', actionManager.getNativeRouterActionTranslator, { childStreamTranslator: stream => nativeTranslator(stream, actionManager) });
  let ret = {};

  for (let streamName of Object.keys(stream).filter(key => key[0] !== '$')) {
    if (!Array.isArray(stream[streamName])) continue;
    ret[streamName] = dfs(stream[streamName], dfs);
  }

  ret.$preload = stream.$preload;
  return ret;
};
