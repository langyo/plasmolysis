import {
  IPlatforms
} from './index';

import * as runtimeManager from './runtimeManager';
import './guleManager';
const {
  packageInfo: actionPresetPackage
} = require('nickelcat-action-preset/context').getContexts;
// const {
//   packageInfo: actionRoutesPackage
// } = require('nickelcat-action-routes/context').getContexts;

let platform: IPlatforms;
let contexts: {
  [type: string]: { [func: string]: (...args: any[]) => any }
} = {};
let configs: { [key: string]: any } = {};

export function getPlatform(): IPlatforms {
  return platform;
}

export function setPlatform(p: IPlatforms) {
  if (typeof platform === 'undefined') {
    platform = p;
  } else {
    throw new Error('You cannot set the platform tag for twice!');
  }
}
export function loadActionPackage(
  getter: (platform: IPlatforms) => { [key: string]: any }
): void {
  contexts = {
    ...contexts,
    ...getter(platform)
  }
}

// Initialize the preset package.
loadActionPackage(actionPresetPackage);
// loadActionPackage(actionRoutesPackage);

export function getContexts(): any {
  return new Proxy({}, {
    get: (_, p) => {
      if (typeof contexts[p as string] !== 'undefined') {
        return Object.freeze(contexts[p as string]);
      } else if (p === 'contextManager') {
        return Object.freeze({
          getContexts,
          loadActionPackage
        });
      } else if (p === 'runtimeManager') {
        return Object.freeze(runtimeManager);
      } else {
        throw new Error(`Unknown context: ${p as string}.`);
      }
    }
  });
}

export function getConfig(context: string): Readonly<{ [key: string]: any }> {
  if (typeof configs[context] === 'undefined') {
    return Object.freeze({});
  } else {
    return Object.freeze(configs[context]);
  }
}

export function setConfig(
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