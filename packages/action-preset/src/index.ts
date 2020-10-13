import {
  IPlatforms,
  IProjectPackage,
  IWebClientComponentType,
  IRuntimeObject
} from '../../core';
export {
  IPlatforms,
  IProjectPackage,
  IWebClientComponentType,
  IRuntimeObject
};

export interface IStateManager {
  readonly setState: (
    modelID: string,
    combineState: { [key: string]: any }
  ) => void,
  readonly getState: (modelID: string) => Readonly<{ [key: string]: any }>,
  readonly setGlobalState: (combineState: { [key: string]: any }) => void,
  readonly getGlobalState: () => Readonly<({ [key: string]: any })>,
  readonly getModelList: () => Readonly<{ [modelType: string]: string[] }>,
  readonly getModelIDList: () => Readonly<{ [modelID: string]: string }>,
  readonly createModel: (
    modelType: string,
    initState?: { [key: string]: any },
    modelID?: string
  ) => void,
  readonly destoryModel: (modelID: string) => void,
  readonly evaluateModelAction: (
    modelID: string,
    actionType: string,
    payload: { [key: string]: any }
  ) => { [key: string]: any },

  readonly appendListener: (func: (
    prevIDList: { [modelID: string]: string },
    nextIDList: { [modelID: string]: string }
  ) => void, id: string) => void,
  readonly removeListener: (id: string) => void
}

export interface IModelManager {
  readonly storageModel: (
    modelType: string,
    component: IWebClientComponentType
  ) => void,
  readonly loadPackage: (projectPackage: IProjectPackage) => void,
  readonly loadComponent: (type: string) => IWebClientComponentType,
  readonly getModelList: () => string[]
}

export interface IGetters {
  modelType: string,
  modelID: string,
  getState: () => { [key: string]: any },
  getGlobalState: () => { [key: string]: any },
  getPageType: () => string,
  getModelList: () => { [modelType: string]: string[] }
};

export { createModel } from './lib/createModel';
export { destoryModel } from './lib/destoryModel';
export { setGlobalState } from './lib/setGlobalState';
export { setState } from './lib/setState';
