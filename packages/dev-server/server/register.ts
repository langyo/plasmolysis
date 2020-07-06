import createStream from './streamGenerator';

import { serverLog as log } from 'nickelcat/utils/logger';
import merge from '../utils/deepMerge';
import templatePageGenerator from './templatePageGenerator';

let routes = {};

const createRoutes = ({
  streams,
  path
}, extraArgs = {}, actionManager) => {
  for (let streamName of Object.keys(streams)) {
    if (streamName[0] === '$') continue;
    for (let i = 1; i < streams[streamName].length; ++i) {
      if (!Array.isArray(streams[streamName][i])) {
        const route = actionManager.getServerRouterActionExecutor(streams[streamName][i].$$type)(streams[streamName][i])({
          execChildStream: (stream, extraArgs = {}) => payload => createStream({ actionManager })({ tasks: [extraArgs, ...stream], path })(payload)
        });

        log('info', `Parsed the static route: ${path}.${streamName}[${i}]`, route);
        routes = merge(routes, route);
      } else {
        createRoutes({
          tasks: streams[streamName][i],
          path: `${path}.${streamName}[${i}]`
        }, extraArgs, actionManager);
      }
    }
  }
};

export const initRoutes = ({
  rootPageRelay
}, modelManager, actionManager) => {
  // Normal actions
  for (let modelType of modelManager.getModelList()) {
    createRoutes({ streams: modelManager.getServerRouterStream(modelType), path: modelType }, {}, actionManager);
  }
  // Page routes
  for (let modelType of modelManager.getModelList()) {
    // Set the route only for models with page prefixes.
    if (!/^pages?\./.test(modelType)) continue;
    
    if (!routes.http) routes.http = {};
    routes.http[`/${modelType}`] = templatePageGenerator(modelType, actionManager);
  }
  if (rootPageRelay) {
    if (modelManager.getModelList().indexOf(rootPageRelay) < 0) log('warn', `Unknown root page's name: ${rootPageRelay}.`);
    else routes.http['/'] = templatePageGenerator(rootPageRelay, actionManager);
  }
};

export const getRoutes = () => routes;
