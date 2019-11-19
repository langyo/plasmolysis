import context from '../server/context';

import { readdirSync, statSync } from 'fs';
import { resolve } from 'path';

const fileReadDir = name => {
  let files = readdirSync(name);
  let ret = {};

  for (let file of files) {
    if (statSync(`${name}/${file}`).isDirectory())
      ret[file] = fileReadDir(`${name}/${file}`);
    else ret[file] = require(`${name}/${file}`).default;
  }

  return ret;
};

const controllers = fileReadDir(resolve('./controllers'));

let services = {};

for (let type of ['models', 'pages', 'views']) {
  for (let name of Object.keys(controllers[type])) {
    // 生成动作表
    let dealed = controllers[type][name]({
      setState: () => null,
      setData: () => null,
      dispatch: () => null,
      fetch: () => null,
      send: () => null,
      route: () => null,
      handle: func => ({ type: 'handle', func })
    });

    // 去除所有的不用于表达动作的特殊键
    dealed = Object.keys(dealed)
      .filter(name => name !== 'init')
      .reduce((prev, next) => ({ ...prev, [next]: dealed[next] }), {});

    // 对其中每个作为数组存在的元素进行扁平化
    dealed = Object.keys(dealed).reduce((prev, action) => {
      const dfs = arr =>arr.reduce(
        (prev, next) => Array.isArray(next) ? prev.concat(dfs(next)) : [...prev, next],
        []
      );
      return ({
        ...prev,
        [action]: dfs(dealed[action])
      });
    }, {});

    // 整合所有的 fetch
    dealed = Object.keys(dealed).reduce((prev, action) => {
      if (dealed[action]) {
        return ({
          ...prev,
          [action]: Object.keys(dealed[action]).reduce((prev, next) => {
            if (dealed[action][next]) {
              switch (dealed[action][next].type) {
                case 'fetch':
                case 'send':
                case 'route':
                  break;
                case 'handle':
                  return [...prev, { type: 'fetchCombine', func: dealed[action][next].func }];
                default:
                  return [...prev, dealed[action][next]];
              }
            } else return prev;
          }, [])
        });
      }
      else return prev;
    }, {});

    for (let action of Object.keys(dealed)) {
      for (let task of dealed[action]) {
        switch (task.type) {
          case 'setState':
          case 'dispatch':
            break;
          case 'fetchCombine':
            console.log('New service:', task);
            services[task.route.path] = context => (req, res) => task.handle(req.body, context, json => {
              res.send(JSON.stringify(json));
              res.end();
            });
            break;
          default:
            throw new Error('未知的流动作！');
        }
      }
    }
  }
}

export default server => {
  for (let path of Object.keys(services)) {
    server.use(path, (req, res) => services[path](context)(req, res));
  }
}