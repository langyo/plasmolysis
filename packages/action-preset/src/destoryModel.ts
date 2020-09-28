import {
  IGetters,
  IRuntime,
  IPlatforms
} from '../index';

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