import {
  IPlatforms,
  IProjectPackage,
  IWebClientComponentType,
  IRuntime
} from '../core';

import { generate } from 'shortid';

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

export function createModel(
  func: (payload: { [key: string]: any }, utils: IGetters) => {
    type: string,
    initState: { [key: string]: any },
    name?: string
  }
): IRuntime;
export function createModel(
  type: string,
  initState?: { [key: string]: any },
  name?: string
): IRuntime;
export function createModel(
  arg0: ((payload: { [key: string]: any }, utils: IGetters) => {
    type: string,
    initState: { [key: string]: any },
    name?: string
  }) | string,
  arg1?: { [key: string]: any },
  arg2?: string
): IRuntime {
  const generator = typeof arg0 === 'string' ? () => ({
    type: arg0,
    initState: arg1 || {},
    name: arg2 || generate()
  }) : arg0;

  return (platform: IPlatforms) => platform === 'webClient' ? async (
    payload, {
      stateManager: {
        getState,
        getGlobalState,
        getModelList,
        createModel
      },
      routeManager: {
        getPageType
      }
    }, {
      modelType, modelID
    }
  ) => {
    const { type, initState, name } = generator(payload, {
      getState: () => getState(modelID),
      getGlobalState,
      getModelList,
      getPageType,
      modelType,
      modelID
    });
    createModel(type, initState, name);
    return payload;
  } : undefined;
};

export function destoryModel(
  func: (payload: { [key: string]: any }, utils: IGetters) => {
    id: string
  }
): IRuntime;
export function destoryModel(id: string): IRuntime;
export function destoryModel(
  arg0: ((payload: { [key: string]: any }, utils: IGetters) => {
    id: string
  }) | string
): IRuntime {
  const generator = typeof arg0 === 'string' ? () => ({ id: arg0 }) : arg0;
  return (platform: IPlatforms) => platform === 'webClient' ? async (
    payload, {
      stateManager: {
        getState,
        getGlobalState,
        getModelList,
        destoryModel
      },
      routeManager: {
        getPageType
      }
    }, {
      modelType, modelID
    }
  ) => {
    const { id } = generator(payload, {
      getState: () => getState(modelID),
      getGlobalState,
      getModelList,
      getPageType,
      modelType,
      modelID
    });
    destoryModel(id);
    return payload;
  } : undefined;
};

export function dispatch(
  func: (payload: { [key: string]: any }, utils: IGetters) => {
    id: string,
    action: string,
    payload: { [key: string]: any }
  }
): IRuntime;
export function dispatch(
  id: string,
  action: string,
  payload: { [key: string]: any }
): IRuntime;
export function dispatch(
  arg0: ((payload: { [key: string]: any }, utils: IGetters) => {
    id: string,
    action: string,
    payload: { [key: string]: any }
  }) | string,
  arg1?: string,
  arg2?: { [key: string]: any }
): IRuntime {
  const generator = typeof arg0 === 'string' ? () => ({
    id: arg0, action: arg1, payload: arg2
  }) : arg0;
  return (platform: IPlatforms) => platform === 'webClient' ? async (
    payload: { [key: string]: any }, {
      stateManager: {
        getState,
        getGlobalState,
        getModelList,
        evaluateModelAction
      },
      routeManager: {
        getPageType
      }
    }, {
      modelType, modelID
    }) => {
    const { id, action, payload: retPayload } = generator(payload, {
      getState: () => getState(modelID),
      getGlobalState,
      getModelList,
      getPageType,
      modelType,
      modelID
    });
    evaluateModelAction(id, action, retPayload);
    return payload;
  } : undefined;
};

import axios from 'axios';
export function fetch(
  path: string,
  runtime?: IRuntime
): IRuntime
export function fetch(
  path: string,
  translator: ((payload: { [key: string]: any }, utils: IGetters) => {
    [key: string]: any
  })
): IRuntime;
export function fetch(
  path: string,
  translator: ((payload: { [key: string]: any }, utils: IGetters) => {
    [key: string]: any
  }),
  runtime: IRuntime
): IRuntime;
export function fetch(
  path: string,
  arg0?: ((payload: { [key: string]: any }, utils: IGetters) => {
    [key: string]: any
  }) | IRuntime,
  arg1?: IRuntime
): IRuntime {
  const { runtime, translator } = Array.isArray(arg0) ? {
    translator: (n: any) => n, runtime: arg0 as IRuntime
  } : {
      translator: arg0 as (
        payload: { [key: string]: any }, utils: IGetters
      ) => {
        [key: string]: any
      },
      runtime: arg1
    };

  return (platform, { runtimeManager: { loadRuntime } }) => {
    switch (platform) {
      case 'webClient':
        return async (
          payload: { [key: string]: any }, {
            stateManager: {
              getState,
              getGlobalState,
              getModelList
            },
            routeManager: {
              getPageType
            }
          }, {
            modelType, modelID
          }) => {
          const body = translator(payload, {
            getState: () => getState(modelID),
            getGlobalState,
            getModelList,
            getPageType,
            modelType,
            modelID
          });
          return JSON.parse(await axios.post(path, body));
        };
      case 'nodeServer':
        if (typeof runtime !== 'undefined') {
          loadRuntime(runtime, 'nodeServer', 'http', path);
        }
        return undefined;
      default:
        return undefined;
    }
  };
}

export function setGlobalState(
  func: (payload: { [key: string]: any }, utils: IGetters) => {
    [key: string]: any
  }
): IRuntime;
export function setGlobalState(
  combinedObj: { [key: string]: any }
): IRuntime;
export function setGlobalState(
  arg0: (payload: { [key: string]: any }, utils: IGetters) => {
    [key: string]: any
  } | { [key: string]: any }
): IRuntime {
  const generator = typeof arg0 === 'string' ? () => arg0 : arg0;
  return (platform: IPlatforms) => platform === 'webClient' ? async (
    payload: { [key: string]: any }, {
      stateManager: {
        getState,
        getGlobalState,
        getModelList,
        setGlobalState
      },
      routeManager: {
        getPageType
      }
    }, {
      modelType, modelID
    }) => {
    const obj = generator(payload, {
      getState: () => getState(modelID),
      getGlobalState,
      getModelList,
      getPageType,
      modelType,
      modelID
    });
    setGlobalState(obj);
    return payload;
  } : undefined;
};

export function setState(
  func: (payload: { [key: string]: any }, utils: IGetters) => {
    [key: string]: any
  }
): IRuntime;
export function setState(
  combinedObj: { [key: string]: any }
): IRuntime;
export function setState(
  arg0: (payload: { [key: string]: any }, utils: IGetters) => {
    [key: string]: any
  } | { [key: string]: any }
): IRuntime {
  const generator = typeof arg0 === 'string' ? () => arg0 : arg0;
  return (platform: IPlatforms) => platform === 'webClient' ? async (
    payload: { [key: string]: any }, {
      stateManager: {
        getState,
        getGlobalState,
        getModelList,
        setState
      },
      routeManager: {
        getPageType
      }
    }, {
      modelType, modelID
    }) => {
    const obj = generator(payload, {
      getState: () => getState(modelID),
      getGlobalState,
      getModelList,
      getPageType,
      modelType,
      modelID
    });
    setState(modelID, obj);
    return payload;
  } : undefined;
};

export function wait(
  func: (payload: { [key: string]: any }, utils: IGetters) => number
): IRuntime;
export function wait(length: number): IRuntime;
export function wait(
  arg0: ((payload: { [key: string]: any }, utils: IGetters) => number) | number
): IRuntime {
  const generator = typeof arg0 === 'number' ? () => arg0 : arg0;
  return (platform: IPlatforms) => platform === 'webClient' ? async (
    payload: { [key: string]: any }, {
      stateManager: {
        getState,
        getGlobalState,
        getModelList
      },
      routeManager: {
        getPageType
      }
    }, {
      modelType, modelID
    }) => {
    const length = generator(payload, {
      getState: () => getState(modelID),
      getGlobalState,
      getModelList,
      getPageType,
      modelType,
      modelID
    });
    return await (new Promise(resolve =>
      setTimeout(() => resolve(payload), length)
    ));
  } : undefined;
};
