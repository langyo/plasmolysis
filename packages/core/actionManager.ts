/// <reference path="type.d.ts" />

import streamManager from './streamManager';
import actionPresetPackage from 'nickelcat-action-preset/package';
import actionRoutesPackage from 'nickelcat-action-routes/package';

type Translators = {
  [platform in Platforms]: {
    [name: string]: TranslatorFunc
  }
};
type Executors = {
  [platform in Platforms]: {
    [name: string]: ExecutorFunc
  }
};
type Contexts = {
  [platform in Platforms]: {
    [type: string]: {
      [func: string]: (...args: any[]) => any
    }
  }
};

export default function (projectPackage: ProjectPackage): ActionManager {
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
  const sharedStreamManager: StreamManager = streamManager(projectPackage, getContext);

  function getContext(platform: Platforms): GetContextFuncType {
    return function (type: string): any {
      if (type === 'actionManager') return Object.freeze({
        getContext,
        getExecutor,
        getTranslator,
        loadPackage
      });
      if (type === 'streamManager') return sharedStreamManager;
      if (typeof contexts[platform][type] === 'undefined')
        throw new Error(`Unknown context '${type}' at the platform '${platform}'`);
      return contexts[platform][type];
    };
  }

  function getTranslator(platform: Platforms, name: string): TranslatorFunc {
    if (typeof translators[platform][name] === 'undefined') throw new Error(`Unknown translator '${name}'`);
    return translators[platform][name];
  }

  function getExecutor(platform: Platforms, name: string): ExecutorFunc {
    if (typeof executors[platform][name] === 'undefined') throw new Error(`Unknown executor '${name}'`);
    return executors[platform][name];
  }

  function loadPackage(packageInfo: PackageInfo): void {
    for (const platform of Object.keys(packageInfo.actions)) {
      for (const actionName of Object.keys(packageInfo.actions[platform])) {
        translators[platform][actionName] = packageInfo.actions[platform][actionName].translator;
        executors[platform][actionName] = packageInfo.actions[platform][actionName].executor;
      }
    }
    for (const platform of Object.keys(packageInfo.contexts)) {
      for (const type of Object.keys(packageInfo.contexts[platform])) {
        contexts[platform][type] = packageInfo.contexts[platform][type](projectPackage, getContext);
      }
    }
  }

  // Initialize the preset package.
  loadPackage(actionPresetPackage);
  loadPackage(actionRoutesPackage);

  return Object.freeze({
    getContext,
    getExecutor,
    getTranslator,
    loadPackage
  });
}