import {
  IPlatforms,
  IContextManager,
  IRuntimeManager,
  IGlueManager
} from './index';

import { runtimeManagerFactory } from './runtimeManager';
import { glueManagerFactory } from './guleManager';
const {
  packageInfo: actionPresetPackage
} = require('nickelcat-action-preset/context').getContexts;
// const {
//   packageInfo: actionRoutesPackage
// } = require('nickelcat-action-routes/context').getContexts;

export function contextManagerFactory(
  platform: IPlatforms
): IContextManager {
  let contexts: {
    [type: string]: { [func: string]: (...args: any[]) => any }
  } = {};
  let configs: { [key: string]: any } = {};

  const contextManagerObj = Object.freeze({
    getContexts,
    getConfig,
    setConfig,
    loadActionPackage
  });
  const glueManager: IGlueManager =
    glueManagerFactory(contextManagerObj, platform);
  const runtimeManager: IRuntimeManager =
    runtimeManagerFactory(contextManagerObj, platform);

  function loadActionPackage(
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

  function getContexts(): any {
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

  function getConfig(context: string): Readonly<{ [key: string]: any }> {
    if (typeof configs[context] === 'undefined') {
      return Object.freeze({});
    } else {
      return Object.freeze(configs[context]);
    }
  }

  function setConfig(context: string, value: { [key: string]: any }): void {
    if (typeof configs[context] === 'undefined') {
      configs[context] = value;
    } else {
      configs[context] = {
        ...configs[context],
        ...value
      };
    }
  }

  return Object.freeze({
    getContexts,
    getConfig,
    setConfig,
    loadActionPackage
  });
}