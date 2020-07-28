import {
  ActionObject,
  ActionBridgeObject
} from '../../../core/type';
import React = require('react');

export interface NodeServerGlobalContext {
  getSessionList: () => Promise<Array<string>>
}

export interface NodeServerLocalContext {
  ip: string,
  sessionID: string
}

export interface ISourceComponentRequireObj {
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

interface ITranslatedStreams {
  [key: string]: {
    [key: string]: Array<ActionObject>
  }
}

export default (requireComponents: ISourceComponentRequireObj) => {
  let components: { [key: string]: IComponent } = {};
  let initializer = {};
  let preloader = {};
  let originControllerStreams = {};

  let streamRuntimeFuncs: ITranslatedStreams = {};

  const storageModel = (modelType, { component, controller }) => {
    components[modelType] = component;
    originControllerStreams[modelType] = controller;

    if (controller.$init) initializer[modelType] = controller.$init;
    else initializer[modelType] = obj => obj;
    if (controller.$preload) preloader[modelType] = controller.$preload;
    else preloader[modelType] = async obj => ({ payload: (obj && obj.query || {}) });


  };

  console.assert(typeof requireComponents === 'object');
  for (const modelType of Object.keys(requireComponents)) {
    storageModel(modelType, requireComponents[modelType]);
  }

  return Object.seal({
    storageModel,

    loadComponent(type) {
      return components[type];
    },

    getModelList() {
      return Object.keys(components);
    },
    
    getStreamRuntime(platform: string, moduleType: string): Array<ActionObject> {
      return streamRuntimeFuncs[platform][moduleType];
    }
  });
};
