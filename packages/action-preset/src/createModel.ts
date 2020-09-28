import {
  IGetters,
  IRuntime,
  IPlatforms
} from '../index';
import { generate } from 'shortid';

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