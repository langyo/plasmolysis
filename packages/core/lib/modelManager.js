import {
  clientTranslator,
  serverRouterTranslator,
  nativeRouterTranslator
} from './translator';

class ModelStorage {
  constructor() {
    this.components = {};
    this.initializer = {};
    this.preloader = {};
    this.originControllerStreams = {};

    this.clientControllerStreams = {};
    this.serverControllerStreams = {};
    this.nativeControllerStreams = {};
  }

  storageModel({ modelType, component, controllers }) {
    this.components[modelType] = component;
    this.originControllerStreams[modelType] = controllers;

    if (controllers.$init) this.initializer[modelType] = controllers.$init;
    else this.initializer[modelType] = obj => obj;
    if (controllers.$preload) this.preloader[modelType] = controllers.$preload;
    else this.preloader[modelType] = async obj => ({ payload: (obj && obj.query || {}) });

    this.clientControllerStreams[modelType] = clientTranslator(controllers);
    this.serverControllerStreams[modelType] = serverRouterTranslator(controllers);
    this.nativeControllerStreams[modelType] = nativeRouterTranslator(controllers);
  };

  // _storageViewController(controllers) {
  //   if (controllers.$init) this.initializer.$view = controllers.$init;
  //   if (controllers.$preload) this.preloader.$view = controllers.$preload;
  //   this.originControllerStreams.$view = Object.keys(controllers).filter(key => key !== '$init' && key !== '$preload').reduce(
  //     (obj, key) => ({ ...obj, [key]: controllers[key] }), {}
  //   );
  // }

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

export default () => new ModelStorage();
