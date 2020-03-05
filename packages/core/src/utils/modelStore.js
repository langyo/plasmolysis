let models = {};
let initializer = {};
let preloader = {};
let controllerStreams = {};

export const storageModel = (factory, controllers, type) => {
  models[type] = factory;
  if (controllers.$init) initializer[type] = controllers.$init;
  if (controllers.$preload) preloader[type] = controllers.$preload;
  controllerStream[type] = Object.keys(controllers).filter(key => key !== '$init' && key !== '$preload').reduce(
    (obj, key) => ({ ...obj, [key]: controllers[key] }), {}
  );
};

export const loadModel = (type, payload = {}) => models[type](payload);

export const getModelList = () => Object.keys(models);

export const getInitializer = type => initializer[type] || init => init;

export const getPreloader = type => preloader[type] || async (init) => init;

export const getStream = type => controllerStream[type] || [];
