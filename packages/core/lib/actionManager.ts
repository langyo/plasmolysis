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

class ActionManager {
  constructor({ $packageName: packageName, $actions: actions, $routers: routers }) {
    this.actionsCreator = {};

    this.clientContextCreatorActionsExecutor = {};
    this.serverContextCreatorActionsExecutor = {};
    this.nativeContextCreatorActionsExecutor = {};
    this.clientActionsExecutor = {};
    this.serverRouterActionsExecutor = {};
    this.serverActionsExecutor = {};
    this.nativeRouterActionsExecutor = {};
    this.nativeActionsExecutor = {};

    this.clientContextCreatorActionsTranslator = {};
    this.serverContextCreatorActionsTranslator = {};
    this.nativeContextCreatorActionsTranslator = {};
    this.clientActionsTranslator = {};
    this.serverRouterActionsTranslator = {};
    this.serverActionsTranslator = {};
    this.nativeRouterActionsTranslator = {};
    this.nativeActionsTranslator = {};

    this.serverRouters = {};
    this.nativeRouters = {};

    if (typeof packageName !== 'string') throw new Error('You must provide the action provider\'s name');
    if (typeof actions !== 'object') throw new Error('You must provide the actions.');

    if (packageName === 'preset') {
      // The special provider 'preset' will store to the root object directly.
      for (const key of Object.keys(actions)) {
        this.actionsCreator[key] = (...args) => ({ ...actions[key].creator(...args), $$type: key });

        this.clientContextCreatorActionsTranslator[key] = actions[key].translator && actions[key].translator.clientContextCreator || (actions[key].executor.clientContextCreator && (p => [p]) || (() => []));
        this.serverContextCreatorActionsTranslator[key] = actions[key].translator && actions[key].translator.serverContextCreator || (actions[key].executor.serverContextCreator && (p => [p]) || (() => []));
        this.nativeContextCreatorActionsTranslator[key] = actions[key].translator && actions[key].translator.nativeContextCreator || (actions[key].executor.nativeContextCreator && (p => [p]) || (() => []));
        this.clientActionsTranslator[key] = actions[key].translator && actions[key].translator.client || (actions[key].executor.client && (p => [p]) || (() => []));
        this.serverRouterActionsTranslator[key] = actions[key].translator && actions[key].translator.serverRouter || (actions[key].executor.serverRouter && (p => [p]) || (() => []));
        this.serverActionsTranslator[key] = actions[key].translator && actions[key].translator.server || (actions[key].executor.server && (p => [p]) || (() => []));
        this.nativeRouterActionsTranslator[key] = actions[key].translator && actions[key].translator.nativeRouter || (actions[key].executor.nativeRouter && (p => [p]) || (() => []));
        this.nativeActionsTranslator[key] = actions[key].translator && actions[key].translator.native || (actions[key].executor.native && (p => [p]) || (() => []));

        this.clientContextCreatorActionsExecutor[key] = actions[key].executor.clientContextCreator || (p => p);
        this.serverContextCreatorActionsExecutor[key] = actions[key].executor.serverContextCreator || (p => p);
        this.nativeContextCreatorActionsExecutor[key] = actions[key].executor.nativeContextCreator || (p => p);
        this.clientActionsExecutor[key] = actions[key].executor.client || (p => p);
        this.serverRouterActionsExecutor[key] = actions[key].executor.serverRouter || (p => p);
        this.serverActionsExecutor[key] = actions[key].executor.server || (p => p);
        this.nativeRouterActionsExecutor[key] = actions[key].executor.nativeRouter || (p => p);
        this.nativeActionsExecutor[key] = actions[key].executor.native || (p => p);
      }
    } else {
      // Otherwise, we will add the namespace before the actions' name.
      for (const key of Object.keys(actions)) {
        this.actionsCreator[`${packageName}.${key}`] = (...args) => ({ ...actions[`${packageName}.${key}`].creator(...args), $$type: `${packageName}.${key}` });

        this.clientContextCreatorActionsTranslator[`${packageName}.${key}`] = actions[key].translator && actions[key].translator.clientContextCreator || (actions[key].executor.clientContextCreator && (p => [p]) || (() => []));
        this.serverContextCreatorActionsTranslator[`${packageName}.${key}`] = actions[key].translator && actions[key].translator.serverContextCreator || (actions[key].executor.serverContextCreator && (p => [p]) || (() => []));
        this.nativeContextCreatorActionsTranslator[`${packageName}.${key}`] = actions[key].translator && actions[key].translator.nativeContextCreator || (actions[key].executor.nativeContextCreator && (p => [p]) || (() => []));
        this.clientActionsTranslator[`${packageName}.${key}`] = actions[key].translator && actions[key].translator.client || (actions[key].executor.client && (p => [p]) || (() => []));
        this.serverRouterActionsTranslator[`${packageName}.${key}`] = actions[key].translator && actions[key].translator.serverRouter || (actions[key].executor.serverRouter && (p => [p]) || (() => []));
        this.serverActionsTranslator[`${packageName}.${key}`] = actions[key].translator && actions[key].translator.server || (actions[key].executor.server && (p => [p]) || (() => []));
        this.nativeRouterActionsTranslator[`${packageName}.${key}`] = actions[key].translator && actions[key].translator.nativeRouter || (actions[key].executor.nativeRouter && (p => [p]) || (() => []));
        this.nativeActionsTranslator[`${packageName}.${key}`] = actions[key].translator && actions[key].translator.native || (actions[key].executor.native && (p => [p]) || (() => []));

        this.clientContextCreatorActionsExecutor[`${packageName}.${key}`] = actions[key].executor.clientContextCreator || (p => p);
        this.serverContextCreatorActionsExecutor[`${packageName}.${key}`] = actions[key].executor.serverContextCreator || (p => p);
        this.nativeContextCreatorActionsExecutor[`${packageName}.${key}`] = actions[key].executor.nativeContextCreator || (p => p);
        this.clientActionsExecutor[`${packageName}.${key}`] = actions[key].executor.client || (p => p);
        this.serverRouterActionsExecutor[`${packageName}.${key}`] = actions[key].executor.serverRouter || (p => p);
        this.serverActionsExecutor[`${packageName}.${key}`] = actions[key].executor.server || (p => p);
        this.nativeRouterActionsExecutor[`${packageName}.${key}`] = actions[key].executor.nativeRouter || (p => p);
        this.nativeActionsExecutor[`${packageName}.${key}`] = actions[key].executor.native || (p => p);
      }
    }

    // Load the routers.
    if (routers) {
      const { server, native } = routers;
      if (server) {
        if (typeof server !== 'object') throw new Error('You should provide an object that contains the routers.');
        this.serverRouters = { ...this.serverRouters, ...server };
      }
      if (native) {
        if (typeof native !== 'object') throw new Error('You should provide an object that contains the routers.');
        this.nativeRouters = { ...this.nativeRouters, ...native };
      }
    }
  }

  getActionCreator = name => {
    if (!this.actionsCreator[name]) throw new Error(`Cannot find the action "${name}"`);
    return this.actionsCreator[name];
  }

  getClientContextCreatorExecutor = name => {
    if (!this.clientContextCreatorActionsExecutor[name]) throw new Error(`Cannot find the action "${name}"`);
    return this.clientContextCreatorActionsExecutor[name];
  }
  getServerContextCreatorExecutor = name => {
    if (!this.serverContextCreatorActionsExecutor[name]) throw new Error(`Cannot find the action "${name}"`);
    return this.serverContextCreatorActionsExecutor[name];
  }
  getNativeContextCreatorExecutor = name => {
    if (!this.nativeContextCreatorActionsExecutor[name]) throw new Error(`Cannot find the action "${name}"`);
    return this.nativeContextCreatorActionsExecutor[name];
  }
  getClientActionExecutor = name => {
    if (!this.clientActionsExecutor[name]) throw new Error(`Cannot find the action "${name}"`);
    return this.clientActionsExecutor[name];
  }
  getServerRouterActionExecutor = name => {
    if (!this.serverRouterActionsExecutor[name]) throw new Error(`Cannot find the action "${name}"`);
    return this.serverRouterActionsExecutor[name];
  }
  getServerActionExecutor = name => {
    if (!this.serverActionsExecutor[name]) throw new Error(`Cannot find the action "${name}"`);
    return this.serverActionsExecutor[name];
  }
  getNativeRouterActionExecutor = name => {
    if (!this.nativeRouterActionsExecutor[name]) throw new Error(`Cannot find the action "${name}"`);
    return this.nativeRouterActionsExecutor[name];
  }
  getNativeActionExecutor = name => {
    if (!this.nativeActionsExecutor[name]) throw new Error(`Cannot find the action "${name}"`);
    return this.nativeActionsExecutor[name];
  }

  getClientContextCreatorTranslator = name => {
    if (!this.clientContextCreatorActionsTranslator[name]) throw new Error(`Cannot find the action "${name}"`);
    return this.clientContextCreatorActionsTranslator[name];
  }
  getServerContextCreatorTranslator = name => {
    if (!this.serverContextCreatorActionsTranslator[name]) throw new Error(`Cannot find the action "${name}"`);
    return this.serverContextCreatorActionsTranslator[name];
  }
  getNativeContextCreatorTranslator = name => {
    if (!this.nativeContextCreatorActionsTranslator[name]) throw new Error(`Cannot find the action "${name}"`);
    return this.nativeContextCreatorActionsTranslator[name];
  }
  getClientActionTranslator = name => {
    if (!this.clientActionsTranslator[name]) throw new Error(`Cannot find the action "${name}"`);
    return this.clientActionsTranslator[name];
  }
  getServerRouterActionTranslator = name => {
    if (!this.serverRouterActionsTranslator[name]) throw new Error(`Cannot find the action "${name}"`);
    return this.serverRouterActionsTranslator[name];
  }
  getServerActionTranslator = name => {
    if (!this.serverActionsTranslator[name]) throw new Error(`Cannot find the action "${name}"`);
    return this.serverActionsTranslator[name];
  }
  getNativeRouterActionTranslator = name => {
    if (!this.nativeRouterActionsTranslator[name]) throw new Error(`Cannot find the action "${name}"`);
    return this.nativeRouterActionsTranslator[name];
  }
  getNativeActionTranslator = name => {
    if (!this.nativeActionsTranslator[name]) throw new Error(`Cannot find the action "${name}"`);
    return this.nativeActionsTranslator[name];
  };

  getServerRouter = type => {
    if (!this.serverRouters[type]) throw new Error(`Cannot find the action "${name}"`);
    return this.serverRouters[type];
  }
  getNativeRouter = type => {
    if (!this.nativeRouters[type]) throw new Error(`Cannot find the action "${name}"`);
    return this.nativeRouters[type];
  }
};

export default obj => new ActionManager(obj);
