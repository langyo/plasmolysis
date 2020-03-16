let components = {};
let initializer = {};
let preloader = {};
let controllerStreams = {};

export const storageModel = ({ modelType, component, controllers }) => {
  components[modelType] = component;
  if (controllers.$init) initializer[modelType] = controllers.$init;
  if (controllers.$preload) preloader[modelType] = controllers.$preload;
  controllerStreams[modelType] = Object.keys(controllers).filter(key => key !== '$init' && key !== '$preload').reduce(
    (obj, key) => ({ ...obj, [key]: controllers[key] }), {}
  );
};

export const loadComponent = type => components[type];

export const getModelList = () => Object.keys(components);

export const getInitializer = type => initializer[type] || (init => init);

export const getPreloader = type => preloader[type] || (async init => init);

export const getStream = type => controllerStream[type] || {};

