import {
  clientTranslator,
  serverRouterTranslator,
  nativeRouterTranslator
} from './translator';

class ModelStorage {
  constructor(components) {
    this.components = {};
    this.initializer = {};
    this.preloader = {};
    this.originControllerStreams = {};

    this.clientControllerStreams = {};
    this.serverControllerStreams = {};
    this.nativeControllerStreams = {};

    if (components) {
      console.assert(typeof components === 'object');
      for (const modelType of Object.keys(components)) {
        this.storageModel(modelType, components[modelType]);
      }
    }
  }

  storageModel(modelType, { component, controller }) {
    this.components[modelType] = component;
    this.originControllerStreams[modelType] = controller;

    if (controller.$init) this.initializer[modelType] = controller.$init;
    else this.initializer[modelType] = obj => obj;
    if (controller.$preload) this.preloader[modelType] = controller.$preload;
    else this.preloader[modelType] = async obj => ({ payload: (obj && obj.query || {}) });

    this.clientControllerStreams[modelType] = clientTranslator(controller);
    this.serverControllerStreams[modelType] = serverRouterTranslator(controller);
    this.nativeControllerStreams[modelType] = nativeRouterTranslator(controller);
  };

  loadComponent(type) {
    return this.components[type];
  }

  getModelList() {
    return Object.keys(this.components);
  }

  getInitializer(type) {
    return this.initializer[type] || (init => init);
  }

  getPreloader(type) {
    return this.preloader[type] || (async init => init);
  }

  getClientStream(type) {
    return this.clientControllerStreams[type] || {};
  }

  getServerRouterStream(type) {
    return this.serverControllerStreams[type] || {};
  }

  getNativeRouterStream(type) {
    return this.nativeControllerStreams[type] || {};
  }
};

export default components => new ModelStorage(components);
