export {
  IPackageInfo,
  IProjectPackage,
  IWebClientComponentType,
  IOriginalActionObject,
  IGetContextFuncType,
  IActionNormalObject,
  IStreamManager
} from '../core/type';
export {
  IRouteManager
} from '../action-routes/type';

import {
  IWebClientComponentType
} from '../core/type';

export interface IWebClientLocalContext {
  modelType: string,
  modelID: string
}

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
  readonly loadComponent: (type: string) => IWebClientComponentType,
  readonly getModelList: () => string[]
}