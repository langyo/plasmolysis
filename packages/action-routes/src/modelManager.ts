import { IRuntimeObject, IWebClientComponentType } from 'nickelcat';
import {
  getRuntimeList,
  runRuntime
} from 'nickelcat/runtimeManager';
import {
  getState,
  getGlobalState,
  createModel
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

declare global {
  interface Window {
    __$bindRenderTasks: {
      [modelType: string]: {
        [modelID: string]: {
          // Initial state from the server.
          [key: string]: any
        }
      }
    }
  }
}

const staticRenderMap = {
  'preset.renderEjsComponent': 'ejs',
  'preset.renderReactComponent': 'react',
  'preset.renderVueComponent': 'vue',
  'preset.renderStaticHtml': 'static'
};

export function storageComponent(
  modelType: string,
  component: IRuntimeObject,
  actions: string[]
): void {
  if (Object.keys(staticRenderMap).indexOf(component.type) < 0) {
    throw new Error(`Unknown component type '${component.type}'`);
  }

  components[modelType] = {
    renderEngine: staticRenderMap[component.type],
    comoponent: component.args.component,
    init: component.args.init,
    actions
  };

  if (typeof window.__$bindRenderTasks[modelType] !== 'undefined') {
    for (const modelID of Object.keys(window.__$bindRenderTasks[modelType])) {
      createModel(
        modelType,
        window.__$bindRenderTasks[modelType][modelID],
        modelID,
        bindComponent(
          modelType, modelID,
          window.__$bindRenderTasks[modelType][modelID]
        )
      );
    }
    delete window.__$bindRenderTasks[modelType];
  }
};

export function getModelList(): string[] {
  return Object.keys(components);
}

// Pre render the component at the server,
// and returns a static DOM string.
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

// Binds data to an existing DOM component,
// and returns a callback called when the component is updated.
export function bindComponent(
  modelType: string,
  modelID: string = generate(),
  initState: { [key: string]: any } = {}
): (() => void) {
  if (typeof components[modelType] === 'undefined') {
    throw new Error(`The component render must exist: '${modelType}'.`);
  }

  switch (components[modelType].renderEngine) {
    case 'react':
      const elementID = `nickelcat-model-${modelID}`;
      hydrate(createElement(components[modelType] as any, {
        ...initState,
        ...getGlobalState(),
        ...components[modelType].actions.reduce((obj, key) => ({
          ...obj,
          [key]:
            (payload: { [key: string]: any }) =>
              runRuntime(modelType, key, modelID, payload)
        }), {})
      }), document.getElementById(elementID));

      return () => {
        render(createElement(components[modelType] as any, {
          ...getState(modelID),
          ...getGlobalState(),
          ...getRuntimeList(
            modelType
          ).reduce((obj, key) => ({
            ...obj,
            [key]:
              (payload: { [key: string]: any }) =>
                runRuntime(modelType, key, modelID, payload)
          }), {})
        }), document.getElementById(elementID));
      };

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
