import { createStream } from 'nickelcat';
import {
  WebClientGlobalContext,
  WebClientLocalContext
} from './modelManager';
import { generate } from 'shortid';
import { from, merge, without } from "seamless-immutable";

interface IModelStateRoute {
  [modelType: string]: Array<string>
};

export interface IGlobalState {
  $pageType?: string,
  $pageID?: string,
  [key: string]: unknown
};

export default (modelManager): WebClientGlobalContext => {
  let globalState: Readonly<object> = from({});
  let modelStateRoute: IModelStateRoute = from({});
  let modelIDMap: { [modelID: string]: string } = from({});
  let modelState: Readonly<object> = from({});

  function setState(modelID: string, combineState: object): void {
    if (
      typeof modelState[modelID] === 'undefined' ||
      typeof modelIDMap[modelID] === 'undefined'
    ) throw new Error(`The model '${modelID}' doesn't exist.`);
    modelState = merge(modelState, { [modelID]: combineState });
  }

  function getState(modelID: string): Readonly<object> {
    if (typeof modelState[modelID] === 'undefined') throw new Error(`The model '${modelID}' doesn't exist.`);
    return from(modelState[modelID]);
  }

  function setGlobalState(combineState: object): void {
    globalState = merge(globalState, combineState);
  }

  function getGlobalState(): IGlobalState {
    return from(globalState);
  }

  function getModelList(): IModelStateRoute {
    return from(modelStateRoute);
  }

  function createModel(modelType: string, initState?: object, modelID?: string): void {
    if (typeof initState === 'undefined') initState = {};
    if (typeof modelID === 'undefined') modelID = generate();

    if (
      typeof modelState[modelID] !== 'undefined' ||
      typeof modelIDMap[modelID] !== 'undefined'
    ) throw new Error(`The model '${modelID}' has been declared.`);

    modelState = merge(modelState, {
      [modelID]:
        modelManager.getStreamRuntime('webClient', modelType).$init(initState)
    });
    modelStateRoute = merge(modelStateRoute, { [modelType]: [...modelStateRoute[modelType], modelID] });
    modelIDMap = merge(modelIDMap, { [modelID]: modelType });
  }

  function destoryModel(modelID: string): void {
    if (
      typeof modelState[modelID] === 'undefined' ||
      typeof modelIDMap[modelID] === 'undefined'
    ) throw new Error(`The model '${modelID}' doesn't exist.`);
    modelState = without(modelState, modelID);
    const modelType = modelIDMap[modelID];
    modelStateRoute = merge(modelStateRoute, { [modelType]: [modelStateRoute[modelType].filter(n => n !== modelID)] });
    modelIDMap = without(modelState, modelID);
  }

  function evaluateModelAction(modelID: string, actionType: string, payload: object): Readonly<object> {
    if (
      Object.keys(modelState).indexOf(modelID) < 0 ||
      Object.keys(modelIDMap).indexOf(modelID) < 0
    ) throw new Error(`The model '${modelID}' doesn't exist.`);
    const modelType = modelIDMap[modelID];
    const streams = modelManager.getStreamRuntime('webClient', modelType);
    if (typeof streams[actionType] === 'undefined') throw new Error(`Unknown action type '${actionType}'.`);
    return streams[actionType](payload);
  }

  const stateManager = Object.seal({
    getState,
    setState,
    getGlobalState,
    setGlobalState,
    getModelList,
    createModel,
    destoryModel,
    evaluateModelAction
  });

  return stateManager;
};
