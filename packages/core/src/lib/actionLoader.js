/*
  Struction:
    [packageName]: {
      name: string,
      packages: {
        [actionName]: {
          creator: function,
          translator: {
            client: function<object => array<object>> | null,
            server: function<object => array<object>> | null,
            native: function<object => array<object>> | null
          } | null,
          executor: {
            client: function | null,
            server: function | null,
            native: function | null
          }
        }
      }
    }
*/
let actionsCreator = {};

let clientActionsExecutor = {};
let serverActionsExecutor = {};
let nativeActionsExecutor = {};

let clientActionsTranslator = {};
let serverActionsTranslator = {};
let nativeActionsTranslator = {};

let serverRouters = {};
let nativeRouters = {};

export const loadActionModel = ({ $packageName: packageName, $actions: actions, $routers: routers }) => {
  if (typeof packageName !== 'string') throw new Error('You must provide the action provider\'s name');
  if (typeof actions !== 'object') throw new Error('You must provide the actions.');

  if (packageName === 'preset') {
    // The special provider 'preset' will store to the root object directly.
    for (let key of Object.keys(actions)) {
      actionsCreator[key] = (...args) => ({ ...actions[key].creator(...args), $$type: key });

      clientActionsTranslator[key] = actions[key].translator && actions[key].translator.client || (actions[key].executor.client && (p => [p]) || (() => []));
      serverActionsTranslator[key] = actions[key].translator && actions[key].translator.server || (actions[key].executor.server && (p => [p]) || (() => []));
      nativeActionsTranslator[key] = actions[key].translator && actions[key].translator.native || (actions[key].executor.native && (p => [p]) || (() => []));

      clientActionsExecutor[key] = actions[key].executor.client || (async p => p);
      serverActionsExecutor[key] = actions[key].executor.server || (async p => p);
      nativeActionsExecutor[key] = actions[key].executor.native || (async p => p);
    }
  } else {
    // Otherwise, we will add the namespace before the actions' name.
    for (let key of Object.keys(actions)) {
      actionsCreator[`${packageName}.${key}`] = (...args) => ({ ...actions[`${packageName}.${key}`].creator(...args), $$type: `${packageName}.${key}` });

      clientActionsTranslator[`${packageName}.${key}`] = actions[key].translator && actions[key].translator.client || (actions[key].executor.client && (p => [p]) || (() => []));
      serverActionsTranslator[`${packageName}.${key}`] = actions[key].translator && actions[key].translator.server || (actions[key].executor.server && (p => [p]) || (() => []));
      nativeActionsTranslator[`${packageName}.${key}`] = actions[key].translator && actions[key].translator.native || (actions[key].executor.native && (p => [p]) || (() => []));

      clientActionsExecutor[`${packageName}.${key}`] = actions[key].executor.client || (async p => p);
      serverActionsExecutor[`${packageName}.${key}`] = actions[key].executor.server || (async p => p);
      nativeActionsExecutor[`${packageName}.${key}`] = actions[key].executor.native || (async p => p);
    }
  }

  // Load the routers.
  if (routers) {
    const { server, native } = routers;
    if (server) {
      if (typeof server !== 'object') throw new Error('You should provide an object that contains the routers.');
      serverRouters = { ...serverRouters, ...server };
    }
    if (native) {
      if (typeof native !== 'object') throw new Error('You should provide an object that contains the routers.');
      nativeRouters = { ...nativeRouters, ...native };
    }
  }
};

export const getActionCreator = name => actionsCreator[name];

export const getClientActionExecutor = name => clientActionsExecutor[name];
export const getServerActionExecutor = name => serverActionsExecutor[name];
export const getNativeActionExecutor = name => nativeActionsExecutor[name];

export const getClientActionTranslator = name => clientActionsTranslator[name];
export const getServerActionTranslator = name => serverActionsTranslator[name];
export const getNativeActionTranslator = name => nativeActionsTranslator[name];

export const getServerRouter = type => serverRouters[type];
export const getNativeRouter = type => nativeRouters[type];
