import {
  getModelList,
  getServerRouterStream
} from '../lib/modelStore';
import {
  getServerRouterActionExecutor
} from '../lib/actionLoader';
import createStream from './createStream';

import { serverLog as log } from '../utils/logger';
import merge from '../utils/deepMerge';
import htmlPageRender from './htmlPageRender';

let routes = {};

const createRoutes = ({
  streams,
  path
}, extraArgs) => {
  for (let streamName of Object.keys(streams)) {
    if (streamName[0] === '$') continue;
    for (let i = 1; i < streams[streamName].length; ++i) {
      if (!Array.isArray(streams[streamName][i])) {
        const route = getServerRouterActionExecutor(streams[streamName][i].$$type)(streams[streamName][i])({
          execChildStream: (stream, extraArgs = {}) => payload => createStream({ tasks: [extraArgs, ...stream], path })(payload)
        });

        log('info', `Parsed the static route: ${path}.${streamName}[${i}]`, route);
        routes = merge(routes, route);
      } else {
        createRoutes({
          tasks: streams[streamName][i],
          path: `${path}.${streamName}[${i}]`
        }, extraArgs);
      }
    }
  }
};

export const initRoutes = ({
  rootPageRelay
}) => {
  // Normal actions
  for (let modelType of getModelList()) {
    createRoutes({ streams: getServerRouterStream(modelType), path: modelType });
  }
  // Page routes
  for (let modelType of getModelList()) {
    if (!routes.http) routes.http = {};
    routes.http[`/${modelType}`] = htmlPageRender(modelType);
  }
  if (rootPageRelay) {
    if (getModelList().indexOf(rootPageRelay) < 0) log('warn', `Unknown root page's name: ${rootPageRelay}.`);
    else routes.http['/'] = htmlPageRender(rootPageRelay);
  }
};

export { createRoutes };

export const getRoutes = () => routes;
