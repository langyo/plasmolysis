import {
  getModelList,
  getServerStream
} from '../lib/modelStore';
import {
  getServerActionExecutor
} from '../lib/actionLoader';
import createStream from './createStream';

import { serverLog as log } from '../utils/logger';
import merge from '../utils/deepMerge';
import htmlPageRender from './htmlPageRender';

let routes = {};

const createRoutes = ({
  tasks,
  path
}, extraArgs) => {
  for (let i = 1; i < tasks.length; ++i) {
    if (!Array.isArray(tasks[i])) {
      if (tasks[i].$$static) {
        const route = getServerActionExecutor(tasks[i].$$type)({
          /* context */
          execChildStream: payload => createStream({ tasks: tasks[i].$$static, path })(payload)
        });

        log('info', `Parsed the static route: ${path}[${i}]`);
        routes = merge(routes, route);
      }
    } else {
      createRoutes({
        tasks: tasks[i],
        path: `${path}[${i}]`
      }, extraArgs);
    }
  }
};

export const initRoutes = ({
  rootPageRelay
}) => {
  // Normal actions
  for (let modelType of getModelList()) {
    createRoutes({ tasks: getServerStream(modelType), path: modelType });
  }
  // Page routes
  for (let modelType of getModelList()) {
    if (!routes.http) routes.http = {};
    routes.http[`/${modelType}`] = htmlPageRender(modelType);
  }
  if (rootPageRelay) {
    log('debug', 'RouteRelay: ', rootPageRelay);
    if (getModelList().indexOf(rootPageRelay) < 0) log('warn', `Unknown root page's name: ${rootPageRelay}.`);
    else routes.http['/'] = htmlPageRender(rootPageRelay);
  }
  log('debug', 'Routes:', routes);
};

export { createRoutes };

export const getRoutes = () => routes;
