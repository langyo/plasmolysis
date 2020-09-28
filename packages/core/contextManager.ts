import {
  IPlatforms,
  IProjectPackage,
  IContextManager,
  IRuntimeManager
} from './index';

import { runtimeManager as runtimeManagerFactory } from './runtimeManager';
const {
  packageInfo: actionPresetPackage
} = require('nickelcat-action-preset/context').getContexts;
const {
  packageInfo: actionRoutesPackage
} = require('nickelcat-action-routes/context').getContexts;

export function contextManager(
  projectPackage: IProjectPackage,
  platform: IPlatforms
): IContextManager {
  let contexts: {
    [type: string]: { [func: string]: (...args: any[]) => any }
  } = {};
  let configs: { [key: string]: any } = {};

  const runtimeManager: IRuntimeManager =
    runtimeManagerFactory(projectPackage, Object.freeze({
      getContexts,
      getConfig,
      setConfig,
      loadProjectPackage,
      loadActionPackage
    }), platform);

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
  loadActionPackage(actionRoutesPackage);

  function getContexts(): any {
    return new Proxy({}, {
      get: (_, p) => {
        if (typeof contexts[p as string] !== 'undefined') {
          return Object.freeze(contexts[p as string]);
        } else if (p === 'contextManager') {
          return Object.freeze({
            getContexts,
            loadProjectPackage,
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

  function loadProjectPackage(projectPackage: IProjectPackage): void {
    runtimeManager.loadPackage(projectPackage);
    for (const platform of Object.keys(projectPackage.config)) {
      configs[platform] = {
        ...configs[platform],
        ...projectPackage.config[platform]
      };
    }

    for (const platform of Object.keys(getContexts)) {
      for (const tag of Object.keys(getContexts[platform])) {
        if (typeof getContexts[tag].loadPackage === 'function') {
          getContexts[tag].loadPackage(projectPackage);
        }
      }
    }
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

  loadProjectPackage(projectPackage);

  return Object.freeze({
    getContexts,
    getConfig,
    setConfig,
    loadProjectPackage,
    loadActionPackage
  });
}