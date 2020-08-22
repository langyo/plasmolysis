/// <reference path="type.d.ts" />

import { streamManager } from './streamManager';
import { packageInfo as actionPresetPackage } from 'nickelcat-action-preset/package';
import { packageInfo as actionRoutesPackage } from 'nickelcat-action-routes/package';

type Translators = {
  [platform in Platforms]: {
    [packageType: string]: {
      [actionType: string]: TranslatorFunc
    }
  }
};
type Executors = {
  [platform in Platforms]: {
    [packageType: string]: {
      [actionType: string]: ExecutorFunc
    }
  }
};
type Contexts = {
  [platform in Platforms]: {
    [type: string]: {
      [func: string]: (...args: any[]) => any
    }
  }
};

export function actionManager(projectPackage: ProjectPackage): ActionManager {
  let translators: Translators = {
    webClient: {},
    nodeServer: {},
    electronClient: {},
    cordovaClient: {},
    flutterClient: {}
  };
  let executors: Executors = {
    webClient: {},
    nodeServer: {},
    electronClient: {},
    cordovaClient: {},
    flutterClient: {}
  };
  let contexts: Contexts = {
    webClient: {},
    nodeServer: {},
    electronClient: {},
    cordovaClient: {},
    flutterClient: {}
  };
  const sharedStreamManager: StreamManager =
    streamManager(projectPackage, getContextFactory);

  function getContextFactory(platform: Platforms): GetContextFuncType {
    return function (type: string): any {
      if (type === 'actionManager') {
        return Object.freeze({
          getContext: getContextFactory,
          getExecutor,
          getTranslator,
          loadPackage
        });
      }
      if (type === 'streamManager') {
        return sharedStreamManager;
      }
      if (typeof contexts[platform][type] === 'undefined') {
        throw new Error(`Unknown context '${type}' at the platform '${platform}'`);
      }
      return contexts[platform][type];
    };
  }

  function getTranslator(
    platform: Platforms,
    packageName: string,
    actionName: string
  ): TranslatorFunc {
    if (
      typeof translators[platform][packageName] === 'undefined' ||
      typeof translators[platform][packageName][actionName] === "undefined"
    ) {
      throw new Error(`Unknown translator '${actionName}' in the package '${packageName}'.`);
    }
    return translators[platform][packageName][actionName];
  }

  function getExecutor(
    platform: Platforms,
    packageName: string,
    actionName: string
  ): ExecutorFunc {
    if (
      typeof executors[platform][packageName] === 'undefined' ||
      typeof executors[platform][packageName][actionName] === 'undefined'
    ) {
      throw new Error(`Unknown executor '${actionName}' in the package '${packageName}'.`);
    }
    return executors[platform][packageName][actionName];
  }

  function loadPackage(packageInfo: PackageInfo): void {
    for (const platform of Object.keys(packageInfo.actions)) {
      for (const actionName of Object.keys(packageInfo.actions[platform])) {
        translators[platform][actionName] =
          packageInfo.actions[platform][actionName].translator;
        executors[platform][actionName] =
          packageInfo.actions[platform][actionName].executor;
      }
    }
    for (const platform of Object.keys(packageInfo.contexts)) {
      for (const type of Object.keys(packageInfo.contexts[platform])) {
        contexts[platform][type] =
          packageInfo.contexts[platform][type](
            projectPackage, getContextFactory(platform as Platforms)
          );
      }
    }
  }

  // Initialize the preset package.
  loadPackage(actionPresetPackage);
  loadPackage(actionRoutesPackage);

  return Object.freeze({
    getContextFactory,
    getExecutor,
    getTranslator,
    loadPackage
  });
}