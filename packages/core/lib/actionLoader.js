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

let clientContextCreatorActionsExecutor = {};
let serverContextCreatorActionsExecutor = {};
let nativeContextCreatorActionsExecutor = {};
let clientActionsExecutor = {};
let serverRouterActionsExecutor = {};
let serverActionsExecutor = {};
let nativeRouterActionsExecutor = {};
let nativeActionsExecutor = {};

let clientContextCreatorActionsTranslator = {};
let serverContextCreatorActionsTranslator = {};
let nativeContextCreatorActionsTranslator = {};
let clientActionsTranslator = {};
let serverRouterActionsTranslator = {};
let serverActionsTranslator = {};
let nativeRouterActionsTranslator = {};
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

      clientContextCreatorActionsTranslator[key] = actions[key].translator && actions[key].translator.clientContextCreator || (actions[key].executor.clientContextCreator && (p => [p]) || (() => []));
      serverContextCreatorActionsTranslator[key] = actions[key].translator && actions[key].translator.serverContextCreator || (actions[key].executor.serverContextCreator && (p => [p]) || (() => []));
      nativeContextCreatorActionsTranslator[key] = actions[key].translator && actions[key].translator.nativeContextCreator || (actions[key].executor.nativeContextCreator && (p => [p]) || (() => []));
      clientActionsTranslator[key] = actions[key].translator && actions[key].translator.client || (actions[key].executor.client && (p => [p]) || (() => []));
      serverRouterActionsTranslator[key] = actions[key].translator && actions[key].translator.serverRouter || (actions[key].executor.serverRouter && (p => [p]) || (() => []));
      serverActionsTranslator[key] = actions[key].translator && actions[key].translator.server || (actions[key].executor.server && (p => [p]) || (() => []));
      nativeRouterActionsTranslator[key] = actions[key].translator && actions[key].translator.nativeRouter || (actions[key].executor.nativeRouter && (p => [p]) || (() => []));
      nativeActionsTranslator[key] = actions[key].translator && actions[key].translator.native || (actions[key].executor.native && (p => [p]) || (() => []));

      clientContextCreatorActionsExecutor[key] = actions[key].executor.clientContextCreator || (p => p);
      serverContextCreatorActionsExecutor[key] = actions[key].executor.serverContextCreator || (p => p);
      nativeContextCreatorActionsExecutor[key] = actions[key].executor.nativeContextCreator || (p => p);
      clientActionsExecutor[key] = actions[key].executor.client || (p => p);
      serverRouterActionsExecutor[key] = actions[key].executor.serverRouter || (p => p);
      serverActionsExecutor[key] = actions[key].executor.server || (p => p);
      nativeRouterActionsExecutor[key] = actions[key].executor.nativeRouter || (p => p);
      nativeActionsExecutor[key] = actions[key].executor.native || (p => p);
    }
  } else {
    // Otherwise, we will add the namespace before the actions' name.
    for (let key of Object.keys(actions)) {
      actionsCreator[`${packageName}.${key}`] = (...args) => ({ ...actions[`${packageName}.${key}`].creator(...args), $$type: `${packageName}.${key}` });

      clientContextCreatorActionsTranslator[`${packageName}.${key}`] = actions[key].translator && actions[key].translator.clientContextCreator || (actions[key].executor.clientContextCreator && (p => [p]) || (() => []));
      serverContextCreatorActionsTranslator[`${packageName}.${key}`] = actions[key].translator && actions[key].translator.serverContextCreator || (actions[key].executor.serverContextCreator && (p => [p]) || (() => []));
      nativeContextCreatorActionsTranslator[`${packageName}.${key}`] = actions[key].translator && actions[key].translator.nativeContextCreator || (actions[key].executor.nativeContextCreator && (p => [p]) || (() => []));
      clientActionsTranslator[`${packageName}.${key}`] = actions[key].translator && actions[key].translator.client || (actions[key].executor.client && (p => [p]) || (() => []));
      serverRouterActionsTranslator[`${packageName}.${key}`] = actions[key].translator && actions[key].translator.serverRouter || (actions[key].executor.serverRouter && (p => [p]) || (() => []));
      serverActionsTranslator[`${packageName}.${key}`] = actions[key].translator && actions[key].translator.server || (actions[key].executor.server && (p => [p]) || (() => []));
      nativeRouterActionsTranslator[`${packageName}.${key}`] = actions[key].translator && actions[key].translator.nativeRouter || (actions[key].executor.nativeRouter && (p => [p]) || (() => []));
      nativeActionsTranslator[`${packageName}.${key}`] = actions[key].translator && actions[key].translator.native || (actions[key].executor.native && (p => [p]) || (() => []));

      clientContextCreatorActionsExecutor[`${packageName}.${key}`] = actions[key].executor.clientContextCreator || (p => p);
      serverContextCreatorActionsExecutor[`${packageName}.${key}`] = actions[key].executor.serverContextCreator || (p => p);
      nativeContextCreatorActionsExecutor[`${packageName}.${key}`] = actions[key].executor.nativeContextCreator || (p => p);
      clientActionsExecutor[`${packageName}.${key}`] = actions[key].executor.client || (p => p);
      serverRouterActionsExecutor[`${packageName}.${key}`] = actions[key].executor.serverRouter || (p => p);
      serverActionsExecutor[`${packageName}.${key}`] = actions[key].executor.server || (p => p);
      nativeRouterActionsExecutor[`${packageName}.${key}`] = actions[key].executor.nativeRouter || (p => p);
      nativeActionsExecutor[`${packageName}.${key}`] = actions[key].executor.native || (p => p);
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

export const getClientContextCreatorExecutor = name => clientContextCreatorActionsExecutor[name];
export const getServerContextCreatorExecutor = name => serverContextCreatorActionsExecutor[name];
export const getNativeContextCreatorExecutor = name => nativeContextCreatorActionsExecutor[name];
export const getClientActionExecutor = name => clientActionsExecutor[name];
export const getServerRouterActionExecutor = name => serverRouterActionsExecutor[name];
export const getServerActionExecutor = name => serverActionsExecutor[name];
export const getNativeRouterActionExecutor = name => nativeRouterActionsExecutor[name];
export const getNativeActionExecutor = name => nativeActionsExecutor[name];

export const getClientContextCreatorTranslator = name => clientContextCreatorActionsTranslator[name];
export const getServerContextCreatorTranslator = name => serverContextCreatorActionsTranslator[name];
export const getNativeContextCreatorTranslator = name => nativeContextCreatorActionsTranslator[name];
export const getClientActionTranslator = name => clientActionsTranslator[name];
export const getServerRouterActionTranslator = name => serverRouterActionsTranslator[name];
export const getServerActionTranslator = name => serverActionsTranslator[name];
export const getNativeRouterActionTranslator = name => nativeRouterActionsTranslator[name];
export const getNativeActionTranslator = name => nativeActionsTranslator[name];

export const getServerRouter = type => serverRouters[type];
export const getNativeRouter = type => nativeRouters[type];
