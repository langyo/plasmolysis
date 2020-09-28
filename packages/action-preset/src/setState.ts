import {
  IGetters,
  IRuntime,
  IPlatforms
} from '../index';

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
