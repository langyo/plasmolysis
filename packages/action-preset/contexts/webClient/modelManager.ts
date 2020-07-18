import {
  ActionObject,
  ActionBridgeObject
} from '../../type';
import React from 'react';

export interface WebClientGlobalContext {
  setState: (modelID: string, combineState: object) => void,
  getState: (modelID: string) => object,
  setGlobalState: (combineState: object) => void,
  getGlobalState: () => ({
    $pageType?: string,
    $pageID?: string,
    [key: string]: unknown
  }),
  getModelList: () => ({ [modelType: string]: Array<string> }),
  createModel: (modelType: string, initState?: object, modelID?: string) => void,
  destoryModel: (modelID: string) => void,
  evaluateModelAction: (modelID: string, actionType: string, payload: object) => object
}

export interface WebClientLocalContext {
  modelType: string,
  modelID: string
}

interface ISourceComponentRequireObj {
  [key: string]: {
    component: IComponent,
    controller: IController
  }
}

interface IComponentProps {
  state: { [key: string]: unknown },
  trigger: { [key: string]: (payload: object) => void }
}

type IComponent = (props: IComponentProps) => string | React.Component;

interface IController {
  [key: string]: Array<ActionObject | ActionBridgeObject>
}

type IStreamRuntime = (payload: object) => object;
interface IStreamRuntimes {
  [key: string]: {
    [key: string]: IStreamRuntime
  }
}

export default (requireComponents: ISourceComponentRequireObj) => {
  let components: { [key: string]: IComponent } = {};
  let originControllerStreams = {};

  let streamRuntimeFunc: IStreamRuntimes = {};

  function storageModel(modelType: string, { component, controller }: { component: IComponent, controller: IController}) {
    components[modelType] = component;
    originControllerStreams[modelType] = controller;
    if (typeof streamRuntimeFunc.webClient === 'undefined') streamRuntimeFunc.webClient = {};

    if (controller.$init) {

    };
    for(const actionName of Object.keys(controller)) {
      if (
        actionName === '$init' ||
        actionName === '$preload'
      ) continue;
      streamRuntimeFunc.webClient[actionName] = createStreamRunner(controller[actionName]);
    }
  };

  for (const modelType of Object.keys(requireComponents)) {
    storageModel(modelType, requireComponents[modelType]);
  }

  function loadComponent(type: string): IComponent {
    return components[type];
  } 

  function getModelList(): Array<string> {
    return Object.keys(components);
  }

  function getStreamRuntime(platform: string, moduleType: string): IStreamRuntime {
    return streamRuntimeFunc[platform][moduleType];
  }

  return Object.seal({
    storageModel,
    loadComponent,
    getModelList,
    getStreamRuntime
  });
};
