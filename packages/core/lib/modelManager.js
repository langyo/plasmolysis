import {
  clientTranslator,
  serverRouterTranslator,
  nativeRouterTranslator
} from './translator';

export default (requireComponents, actionManager) => {
  let components = {};
  let initializer = {};
  let preloader = {};
  let originControllerStreams = {};

  let clientControllerStreams = {};
  let serverControllerStreams = {};
  let nativeControllerStreams = {};

  const storageModel = (modelType, { component, controller }) => {
    components[modelType] = component;
    originControllerStreams[modelType] = controller;

    if (controller.$init) initializer[modelType] = controller.$init;
    else initializer[modelType] = obj => obj;
    if (controller.$preload) preloader[modelType] = controller.$preload;
    else preloader[modelType] = async obj => ({ payload: (obj && obj.query || {}) });

    clientControllerStreams[modelType] = clientTranslator(controller, actionManager);
    serverControllerStreams[modelType] = serverRouterTranslator(controller, actionManager);
    nativeControllerStreams[modelType] = nativeRouterTranslator(controller, actionManager);
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

    getInitializer(type) {
      return initializer[type] || (init => init);
    },

    getPreloader(type) {
      return preloader[type] || (async init => init);
    },

    getClientStream(type) {
      return clientControllerStreams[type] || {};
    },

    getServerRouterStream(type) {
      return serverControllerStreams[type] || {};
    },

    getNativeRouterStream(type) {
      return nativeControllerStreams[type] || {};
    }
  });
};
