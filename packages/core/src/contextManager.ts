import {
  IPlatforms
} from './index';

const platform: IPlatforms = window ? 'js.browser' : 'js.node';
let configs: { [key: string]: unknown } = {};

export function getPlatform(): IPlatforms {
  return platform;
}

export function getConfig(context: string): Readonly<{ [key: string]: unknown }> {
  if (!configs[context]) {
    return Object.freeze({});
  } else {
    return Object.freeze(configs[context]);
  }
}

export function pushConfig(
  context: string,
  value: { [key: string]: unknown }
): void {
  if (!configs[context]) {
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
    if (!beforeHook[target]) {
      beforeHook[target] = [];
    }
    beforeHook[target].unshift(callback);
  } else {
    if (!afterHook[target]) {
      afterHook[target] = [];
    }
    afterHook[target].push(callback as ((ret: unknown) => unknown));
  }
}

export function transferArgs(target: string, args: unknown[]) {
  if (!beforeHook[target]) {
    return args;
  }
  return beforeHook[target].reduce((args, callback) => callback(args), args);
}

export function transferRet(target: string, ret: unknown) {
  if (!afterHook[target]) {
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
