import {
  IGetters,
  IRuntimeObject,
  IPlatforms
} from '../index';

export function setGlobalState(
  func: (payload: { [key: string]: any }, utils: IGetters) => {
    [key: string]: any
  }
): IRuntimeObject;
export function setGlobalState(
  combinedObj: { [key: string]: any }
): IRuntimeObject;
export function setGlobalState(
  arg0: (payload: { [key: string]: any }, utils: IGetters) => {
    [key: string]: any
  } | { [key: string]: any }
): IRuntimeObject {
  const generator = typeof arg0 === 'string' ? () => arg0 : arg0;
  return (platform: IPlatforms) => platform === 'js.browser' ? async (
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
