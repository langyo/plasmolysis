import {
  IPlatforms
} from './index';

const platform: IPlatforms = typeof window !== 'undefined' ? 'js.browser' : 'js.node';
let configs: { [key: string]: unknown } = {};

export function getPlatform(): IPlatforms {
  return platform;
}

export function getConfig(context: string): Readonly<{ [key: string]: unknown }> {
  if (typeof configs[context] === 'undefined') {
    return Object.freeze({});
  } else {
    return Object.freeze(configs[context]);
  }
}

export function pushConfig(
  context: string,
  value: { [key: string]: unknown }
): void {
  if (typeof configs[context] === 'undefined') {
    configs[context] = value;
  } else {
    configs[context] = {
      ...configs[context],
      ...value
    };
  }
}

let beforeHook: {
  [target: string]: ((args: unknown[]) => unknown)[]
} = {};
let afterHook: {
  [target: string]: ((ret: unknown) => unknown)[]
} = {};

export function registerHook(
  beforeOrAfter: 'before', target: string, callback: (args: unknown[]) => unknown
): void;
export function registerHook(
  beforeOrAfter: 'after', target: string, callback: (ret: unknown) => unknown
): void;
export function registerHook(
  beforeOrAfter: 'before' | 'after',
  target: string,
  callback: ((args: unknown[]) => unknown) | ((ret: unknown) => unknown)
): void {
  if (beforeOrAfter === 'before') {
    if (typeof beforeHook[target] === 'undefined') {
      beforeHook[target] = [];
    }
    beforeHook[target].unshift(callback);
  } else {
    if (typeof afterHook[target] === 'undefined') {
      afterHook[target] = [];
    }
    afterHook[target].push(callback);
  }
}

export function transferArgs(target: string, args: unknown[]) {
  if (typeof beforeHook[target] === 'undefined') {
    return args;
  }
  return beforeHook[target].reduce(
    (args, callback) => callback(args), args
  );
}

export function transferRet(target: string, ret: unknown) {
  if (typeof afterHook[target] === 'undefined') {
    return ret;
  }
  return afterHook[target].reduce(
    (ret, callback) => callback(ret), ret
  );
}

export function registerContext(
  contextName: string
): { [config: string]: unknown } {
  return configs[contextName] || {};
}
