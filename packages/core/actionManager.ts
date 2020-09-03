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
const {
  packageInfo: actionPresetPackage
} = require('nickelcat-action-preset/package');
const {
  packageInfo: actionRoutesPackage
} = require('nickelcat-action-routes/package');

type ITranslators = {
  [platform in IPlatforms]: {
    [packageType: string]: {
      [actionType: string]: ITranslatorFunc
    }
  }
};
type IExecutors = {
  [platform in IPlatforms]: {
    [packageType: string]: {
      [actionType: string]: IExecutorFunc
    }
  }
};
type IContexts = {
  [platform in IPlatforms]: {
    [type: string]: {
      [func: string]: (...args: any[]) => any
    }
  }
};
type IConfigs = {
  [platform in IPlatforms]: {
    [tag: string]: any
  }
};

export function actionManager(
  projectPackage: IProjectPackage,
  platform: IPlatforms
): IActionManager {
  let translators: ITranslators = {
    webClient: {},
    nodeServer: {},
    electronClient: {},
    cordovaClient: {},
    flutterClient: {}
  };
  let executors: IExecutors = {
    webClient: {},
    nodeServer: {},
    electronClient: {},
    cordovaClient: {},
    flutterClient: {}
  };
  let contexts: IContexts = {
    webClient: {},
    nodeServer: {},
    electronClient: {},
    cordovaClient: {},
    flutterClient: {}
  };
  let configs: IConfigs = {
    webClient: {},
    nodeServer: {},
    electronClient: {},
    cordovaClient: {},
    flutterClient: {}
  };

  // TODO - Make the action package more pretter?
  function loadActionPackage(packageInfo: IPackageInfo): void {
    for (const platform of Object.keys(packageInfo.actions)) {
      if (platform === '__esModule') { continue; }
      for (const actionName of Object.keys(packageInfo.actions[platform])) {
        if (actionName === '__esModule') { continue; }
        if (typeof translators[platform][packageInfo.name] === 'undefined') {
          translators[platform][packageInfo.name] = {};
        }
        if (typeof executors[platform][packageInfo.name] === 'undefined') {
          executors[platform][packageInfo.name] = {};
        }

        translators[platform][packageInfo.name][actionName] =
          packageInfo.actions[platform][actionName].translator;
        executors[platform][packageInfo.name][actionName] =
          packageInfo.actions[platform][actionName].executor;
      }
    }
    for (const platform of Object.keys(packageInfo.contexts)) {
      if (platform === '__esModule') { continue; }
      for (const type of Object.keys(packageInfo.contexts[platform])) {
        if (type === '__esModule') { continue; }
        contexts[platform][type] =
          packageInfo.contexts[platform][type](
            projectPackage, getContext
          );
      }
    }
  }

  // Initialize the preset package.
  loadActionPackage(actionPresetPackage);
  loadActionPackage(actionRoutesPackage);

  const sharedStreamManager: IStreamManager =
    streamManager(projectPackage, getContext);

  function getContext(type: string): any {
    if (type === 'actionManager') {
      return Object.freeze({
        getContext,
        getExecutor,
        getTranslator,
        loadPackage,
        loadActionPackage
      } as IActionManager);
    }
    if (type === 'streamManager') {
      return sharedStreamManager;
    }
    if (typeof contexts[platform][type] === 'undefined') {
      throw new Error(
        `Unknown context '${type}' at the platform '${platform}'`
      );
    }
    return contexts[platform][type];
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
      throw new Error(
        `Unknown translator '${actionName}' in the package '${packageName}'.`
      );
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
      throw new Error(
        `Unknown executor '${actionName}' in the package '${packageName}'.`
      );
    }
    return executors[platform][packageName][actionName];
  }

  function getConfig(platform: IPlatforms): { [key: string]: any } {
    return { ...configs[platform] };
  }

  function loadPackage(projectPackage: IProjectPackage): void {
    sharedStreamManager.loadPackage(projectPackage);
    for (const platform of Object.keys(projectPackage.config)) {
      configs[platform] = {
        ...configs[platform],
        ...projectPackage.config[platform]
      };
    }

    for (const platform of Object.keys(contexts)) {
      for (const tag of Object.keys(contexts[platform])) {
        if (typeof contexts[platform][tag].loadPackage === 'function') {
          contexts[platform][tag].loadPackage(projectPackage);
        }
      }
    }
  }

  loadPackage(projectPackage);

  return Object.freeze({
    getContext,
    getExecutor,
    getTranslator,
    getConfig,
    loadPackage,
    loadActionPackage
  });
}