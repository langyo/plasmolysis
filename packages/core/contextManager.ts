import {
  IPlatforms,
  IProjectPackage,
  IContextManager,
  IRuntimeManager,
  IPackageInfo
} from './type';

import { runtimeManager as runtimeManagerFactory } from './runtimeManager';
const {
  packageInfo: actionPresetPackage
} = require('nickelcat-action-preset/package');
const {
  packageInfo: actionRoutesPackage
} = require('nickelcat-action-routes/package');

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
      loadProjectPackage,
      loadActionPackage
    }), platform);

  function loadActionPackage(packageInfo: IPackageInfo): void {
    if (typeof packageInfo.contexts[platform] !== 'undefined') {
      for (const type of Object.keys(packageInfo.contexts[platform])) {
        getContexts[type] =
          packageInfo.contexts[platform][type](
            projectPackage, getContexts()
          );
      }
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

  loadProjectPackage(projectPackage);

  return Object.freeze({
    getContexts,
    loadProjectPackage,
    loadActionPackage
  });
}