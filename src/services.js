const context = require('../server/context');

const fs = require('fs');
const path = require('path');

const fileReadDir = name => {
  let files = fs.readdirSync(name);
  let ret = {};

  for(let file of files) {
    if(fs.statSync(`${name}/${file}`).isDirectory())
     ret[file] = fileReadDir(`${name}/${file}`);
    else ret[file] = require(`${name}/${file}`).default;
  }
  
  return ret;
};

const actions = fileReadDir(path.resolve('./actions'));

let services = {};

const $ = require('./$');

for (let type of ['dialogs', 'pages', 'views']) {
  for (let name of Object.keys(actions[type])) {
    for (let action of Object.keys(actions[type][name])) {
      if (action === 'init') continue;

      let { taskList } = actions[type][name][action](new $());

      for (let task of taskList) {
        switch (task.type) {
          case 'setState':
          case 'dispatch':
            break;
          case 'fetchCombine':
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

module.exports = server => {
  for (let path of Object.keys(services)) {
    server.use(path, (req, res) => services[path](context)(req, res));
  }
}