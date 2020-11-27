import { IRuntimeObject, IWebClientComponentType } from 'nickelcat';
import {
  getRuntimeList,
  runRuntime,
} from 'nickelcat/runtimeManager';
import {
  getState,
  getGlobalState,
  appendListener
} from './stateManager';
import { IInitArgs } from './index';

import { createElement } from 'react';
import { renderToString, hydrate, render } from 'react-dom';
import { generate } from 'shortid';

let components: {
  [modelType: string]: {
    renderEngine: 'react' | 'vue' | 'ejs' | 'static'
    comoponent: IWebClientComponentType,
    init: (args: IInitArgs) => { [key: string]: string | number },
    actions: string[]   // The controllers are saved in the runtime manager.
  }
} = {};
let bindRenderTasks: { [modelType: string]: string[] } = {};

export function storageComponent(
  modelType: string,
  actions: { [type: string]: IRuntimeObject }
): void {
  if (
    typeof actions.component === 'undefined' ||
    typeof actions.component.type === 'undefined' ||
    typeof actions.component.args === 'undefined' ||
    typeof actions.component.args.component === 'undefined' ||
    typeof actions.component.args.init === 'undefined'
  ) {
    throw new Error('Need a current component!');
  }
  if ([
    'preset.renderEjsComponent',
    'preset.renderReactComponent',
    'preset.renderVueComponent',
    'preset.renderStaticHtml'
  ].indexOf(actions.component.type) < 0) {
    throw new Error(`Unknown component type '${actions.component.type}'`);
  }

  const staticRenderMap = {
    'preset.renderEjsComponent': 'ejs',
    'preset.renderReactComponent': 'react',
    'preset.renderVueComponent': 'vue',
    'preset.renderStaticHtml': 'static'
  };

  components[modelType] = {
    renderEngine: staticRenderMap[actions.component.type],
    comoponent: actions.component.args.component,
    init: actions.component.args.init,
    actions: Object.keys(actions).filter(
      key => ['path', 'protocol', 'component'].indexOf(key) < 0
    )
  };

  if (typeof bindRenderTasks[modelType] !== 'undefined') {
    for (const modelID of bindRenderTasks[modelType]) {
      bindComponent(modelType, modelID);
    }
    delete bindRenderTasks[modelType];
  }
};

export function getModelList(): string[] {
  return Object.keys(components);
}

export function preRenderComponent(
  modelType: string,
  initArgs: IInitArgs
): string {
  switch (components[modelType].renderEngine) {
    case 'react':
      return renderToString(
        createElement(components[modelType].comoponent as any, {
          ...initArgs,
          ...components[modelType].actions.reduce((obj, key) => ({
            ...obj,
            [key]: () => undefined
          }), {})
        })
      );

    // TODO - The other frameworks' support.
    case 'vue':
    case 'ejs':
    case 'static':
    default:
      throw new Error(
        `Unsupport render framework '${components[modelType].renderEngine}'.`
      );
  }

}

export function bindComponent(
  modelType: string,
  modelID: string = generate()
): string {
  if (typeof components[modelType] === 'undefined') {
    // Wait the render task until the component has registered.
    if (typeof bindRenderTasks[modelType] === 'undefined') {
      bindRenderTasks[modelType] = [];
    }
    bindRenderTasks[modelType].push(modelID);
    return modelID;
  }

  switch (components[modelType].renderEngine) {
    case 'react':
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
      return modelID;

    // TODO - The other frameworks' support.
    case 'vue':
    case 'ejs':
    case 'static':
    default:
      throw new Error(
        `Unsupport render framework '${components[modelType].renderEngine}'.`
      );
  }
}
