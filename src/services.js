/* eslint-disable semi */
import context from '../../../server/context';
import config from '../../../configs/config';

import { readdirSync, statSync } from 'fs';
import { join } from 'path'

const fileReadDir = name => Object.fromEntries(readdirSync(name)
  .map(file => [file, statSync(join(name, file)).isDirectory()])
  .map(([file, isDirectory]) => isDirectory ? [file, fileReadDir(join(name, file))] : [file.slice(0, file.length - 3), require(join(name, file)).default]))

const controllers = fileReadDir('../../../controllers/');
const pagePreload = {};

const services = Object.fromEntries(['models', 'pages', 'views']
  .map(type => [type, controllers[type]])
  .flatMap(([type, controller]) => Object.entries(controller).flatMap(([name, action]) => {
    // 生成动作表
    const dealed = action({
      deal: () => ({ type: 'deal' }),
      togglePage: () => ({ type: 'togglePage' }),
      createModel: () => ({ type: 'createModel' }),
      destoryModel: () => ({ type: 'destoryModel' }),
      setState: () => ({ type: 'setState' }),
      setData: () => ({ type: 'setData' }),
      dispatch: () => ({ type: 'dispatch' }),
      fetch: () => ({ type: 'fetch' }),
      send: () => ({ type: 'send' }),
      route: obj => ({ type: 'route', obj }),
      handle: func => ({ type: 'handle', func }),
      wait: () => ({ type: 'wait' }),
      setCookies: () => ({ type: 'setCookies' })
    });

    // 去除所有的不用于表达动作的特殊键
    if (type === 'pages') pagePreload[name] = dealed.preLoad || (async () => ({}));
    return Object.entries(dealed)
      .filter(([action]) => !['init', 'preLoad'].includes(action))
      // 对其中每个作为数组存在的元素进行扁平化
      .map(([name, action]) => [name, action.flat(Infinity)])
      // 整合所有的 fetch
      .filter(([_action, f]) => Boolean(f))
      .map(([action, f]) => [action, Object.values(f)
        .filter((fValue) => Boolean(fValue))
        .filter((fValue) => !['fetch', 'send'].includes(fValue.type))
        .reduce(({ fetchObj, list }, fValue) => {
          switch (fValue.type) {
            case 'route':
              fetchObj.route = fValue.obj;
              break;
            case 'handle':
              list.push({ type: 'fetchCombine', ...fetchObj, handle: fValue.func });
              fetchObj = {};
              break;
            default:
              list.push(fValue);
          }
          return { fetchObj, list }
        }, { list: [], fetchObj: {} })
        .list
      ])
      .map(([_action, actionValue]) => actionValue)
      .flatMap(actionValue => actionValue
        .filter(task => task.type === 'fetchCombine')
        .map(task => {
          console.log('New service:', task.route.path);
          return [task.route.path, context => (req, res) => task.handle(req.body, context, json => {
            res.send(JSON.stringify(json));
            res.end();
          })]
        }))
  })));

export default server => {
  Object.entries(services).forEach(([path, service]) => server.use(path, (req, res) => service(context)(req, res)))

  Object.entries(pagePreload)
    .map(([page, callback]) => {
      console.log(`New preload service: ${page}`);
      server.use(`/preload/${page}`, (req, res) => {
        callback(context, req.cookies).then(data => {
          res.send(JSON.stringify({
            data,
            cookies: {
              ...config.initCookies,
              ...req.cookies
            }
          }));
          res.end();
        });
      });
    })
}
