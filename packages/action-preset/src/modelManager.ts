import { IWebClientComponentType } from 'nickelcat';
import {
  summonEntity,
  getRuntimeList,
  runRuntime
} from 'nickelcat/runtimeManager';
import {
  getState,
  getGlobalState,
  appendListener
} from './stateManager';
import { IInitArgs } from './index';

import { createElement } from 'react';
import { renderToString, hydrate, render } from 'react-dom';

let components: { [key: string]: IWebClientComponentType } = {};
let bindRenderTasks: { [id: string]: string } = {};

export function storageComponent(
  modelType: string,
  component: IWebClientComponentType,
  initFunc: (args: IInitArgs) => { [key: string]: any }
): void {
  components[modelType] = component;
  // TODO - Deal the render tasks.
};

export function getModelList(): string[] {
  return Object.keys(components);
}

export function preRenderComponent(
  type: string
): string {
  return renderToString(createElement(components[type] as any, {
    // TODO - Write the initialize state from the controller.
  }));
}

export function bindComponent(
  modelType: string,
  modelID: string = summonEntity('modelManager')
): string {
  if (typeof components[modelType] === 'undefined') {
    // Wait the render task until the component has registered.
    bindRenderTasks[modelID] = modelType;
    return modelID;
  }

  const elementID = `nickelcat-model-${modelID}`;
  hydrate(createElement(components[modelType] as any, {
    ...getState(modelID),
    ...getGlobalState(),
    ...getRuntimeList(modelType).reduce((obj, key) => ({
      ...obj,
      [key]: (payload: { [key: string]: any }) =>
        runRuntime(modelType, key, payload, {
          modelType,
          modelID
        })
    }), {})
  }), document.getElementById(elementID));
  appendListener(() => {
    render(createElement(components[modelType] as any, {
      ...getState(modelID),
      ...getGlobalState(),
      ...getRuntimeList(
        modelType
      ).reduce((obj, key) => ({
        ...obj,
        [key]: (payload: { [key: string]: any }) =>
          runRuntime(modelType, key, payload, {
            modelType,
            modelID
          })
      }), {})
    }), document.getElementById(elementID));
  }, modelID);
  summonEntity('modelManager', modelID);
  return modelID;
}
