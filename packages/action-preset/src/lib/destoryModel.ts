import {
  IGetters,
  IRuntimeObject,
  IPlatforms
} from '../index';

export function destoryModel(
  func: (payload: { [key: string]: any }, utils: IGetters) => {
    id: string
  }
): IRuntimeObject;
export function destoryModel(id: string): IRuntimeObject;
export function destoryModel(
  arg0: ((payload: { [key: string]: any }, utils: IGetters) => {
    id: string
  }) | string
): IRuntimeObject {
  const generator = typeof arg0 === 'string' ? () => ({ id: arg0 }) : arg0;
  return (platform: IPlatforms) => platform === 'js.browser' ? async (
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