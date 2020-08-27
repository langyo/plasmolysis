import {
  IPlatforms,
  ITranslatorFunc,
  IExecutorFunc,
  IProjectPackage,
  IActionManager,
  IStreamManager,
  IGetContextFuncType,
  IPackageInfo
} from './type';

import { streamManager } from './streamManager';
const { packageInfo: actionPresetPackage } = require('nickelcat-action-preset/package');
const { packageInfo: actionRoutesPackage } = require('nickelcat-action-routes/package');

type Translators = {
  [platform in IPlatforms]: {
    [packageType: string]: {
      [actionType: string]: ITranslatorFunc
    }
  }
};
type Executors = {
  [platform in IPlatforms]: {
    [packageType: string]: {
      [actionType: string]: IExecutorFunc
    }
  }
};
type Contexts = {
  [platform in IPlatforms]: {
    [type: string]: {
      [func: string]: (...args: any[]) => any
    }
  }
};

export function actionManager(projectPackage: IProjectPackage): IActionManager {
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
  const sharedStreamManager: IStreamManager =
    streamManager(projectPackage, getContextFactory);

  function getContextFactory(platform: IPlatforms): IGetContextFuncType {
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
    platform: IPlatforms,
    packageName: string,
    actionName: string
  ): ITranslatorFunc {
    if (
      typeof translators[platform][packageName] === 'undefined' ||
      typeof translators[platform][packageName][actionName] === "undefined"
    ) {
      throw new Error(`Unknown translator '${actionName}' in the package '${packageName}'.`);
    }
    return translators[platform][packageName][actionName];
  }

  function getExecutor(
    platform: IPlatforms,
    packageName: string,
    actionName: string
  ): IExecutorFunc {
    if (
      typeof executors[platform][packageName] === 'undefined' ||
      typeof executors[platform][packageName][actionName] === 'undefined'
    ) {
      throw new Error(`Unknown executor '${actionName}' in the package '${packageName}'.`);
    }
    return executors[platform][packageName][actionName];
  }

  // TODO - Make the action package more pretter?
  function loadPackage(packageInfo: IPackageInfo): void {
    for (const platform of Object.keys(packageInfo.actions)) {
      if (platform === '__esModule') { continue; }
      for (const actionName of Object.keys(packageInfo.actions[platform])) {
        if (actionName === '__esModule') { continue; }
        translators[platform][actionName] =
          packageInfo.actions[platform][actionName].translator;
        executors[platform][actionName] =
          packageInfo.actions[platform][actionName].executor;
      }
    }
    for (const platform of Object.keys(packageInfo.contexts)) {
      if (platform === '__esModule') { continue; }
      for (const type of Object.keys(packageInfo.contexts[platform])) {
        if (type === '__esModule') { continue; }
        contexts[platform][type] =
          packageInfo.contexts[platform][type](
            projectPackage, getContextFactory(platform as IPlatforms)
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