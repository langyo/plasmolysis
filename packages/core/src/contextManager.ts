import {
  IPlatforms
} from './index';

import { getEntityStatus } from './runtimeManager';
import './guleManager';

import 'nickelcat-action-preset';
import 'nickelcat-action-routes/context';

const platform: IPlatforms = typeof window !== 'undefined' ? 'js.browser' : 'js.node';
let configs: { [key: string]: any } = {};
let variantGetters: { [key: string]: (entityID: string) => { [key: string]: any } } = {};

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

export function registerVariantGetter(
  contextName: string,
  getter: (entityID: string) => { [key: string]: any }
) {
  variantGetters[contextName] = getter;
}

export function getVariants(entityID: string) {
  let ret = {};
  for(const contextName of getEntityStatus(entityID)) {
    if (typeof variantGetters[contextName] !== 'undefined') {
      ret = { ...ret, ...variantGetters[contextName](entityID) };
    }
  }
  return ret;
}
