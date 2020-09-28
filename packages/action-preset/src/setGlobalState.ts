import {
  IGetters,
  IRuntime,
  IPlatforms
} from '../index';

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
