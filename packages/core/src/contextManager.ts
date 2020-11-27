import {
  IPlatforms
} from './index';

import './runtimeManager';
import './actionManager';
import './guleManager';

import 'nickelcat-action-preset';
import 'nickelcat-action-routes/context';

const platform: IPlatforms = typeof window !== 'undefined' ? 'js.browser' : 'js.node';
let configs: { [key: string]: any } = {};

export function getPlatform(): IPlatforms {
  return platform;
}

export function getConfig(context: string): Readonly<{ [key: string]: any }> {
  if (typeof configs[context] === 'undefined') {
    return Object.freeze({});
  } else {
    return Object.freeze(configs[context]);
  }
}

export function pushConfig(
  context: string,
  value: { [key: string]: any }
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
  [target: string]: ((args: any[]) => any)[]
} = {};
let afterHook: {
  [target: string]: ((ret: any) => any)[]
} = {};

export function registerHook(
  beforeOrAfter: 'before', target: string, callback: (args: any[]) => any
): void;
export function registerHook(
  beforeOrAfter: 'after', target: string, callback: (ret: any) => any
): void;
export function registerHook(
  beforeOrAfter: 'before' | 'after',
  target: string,
  callback: ((args: any[]) => any) | ((ret: any) => any)
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

export function transferArgs(target: string, args: any[]) {
  if (typeof beforeHook[target] === 'undefined') {
    return args;
  }
  return beforeHook[target].reduce(
    (args, callback) => callback(args), args
  );
}

export function transferRet(target: string, ret: any) {
  if (typeof afterHook[target] === 'undefined') {
    return ret;
  }
  return afterHook[target].reduce(
    (ret, callback) => callback(ret), ret
  );
}

export function registerContextInit(
  context: string,
  callback: (configs: { [config: string]: any }) => void
) {
  if (typeof configs[context] === 'undefined') {
    throw new Error(`Cannot find the configs for the context '${context}'`);
  }
  callback(configs[context]);
}
