import { existsSync, readdirSync, statSync, readFileSync } from 'fs';
import { resolve, join } from 'path';

import { Volume } from 'memfs';
import { Union } from 'unionfs';
import * as realFs from 'fs';
const joinPath = require('memory-fs/lib/join');

export default async (parseOption = {
  parseFilterComponents: ['', 'dialog.', 'dialogs.', 'page.', 'pages.'],
  parseFilterServices: ['']
}) => {
  let {
    parseFilterComponents,
    parseFilterServices
  } = parseOption;

  let components = [];
  let services = [];
  let configs = {};

  const scanDfs = (path, route = '') => {
    let list = [];
    for (let fileName of readdirSync(path))
      if (statSync(join(path, fileName)).isDirectory())
        list = list.concat(scanDfs(join(path, fileName), `${route}${fileName}.`));
      else if (/(\.js)|(\.mjs)|(\.ts)|(\.jsx)|(\.tsx)$/.test(fileName))
        list.push({ fileName: `${route}${fileName.slice(0, fileName.lastIndexOf('.'))}`, path: join(path, fileName), route });
    return list;
  }

  if (
    existsSync(resolve(process.cwd(), './components')) && statSync(resolve(process.cwd(), './components')).isDirectory() &&
    existsSync(resolve(process.cwd(), './controllers')) && statSync(resolve(process.cwd(), './controllers')).isDirectory()
  ) {
    let componentsPath = scanDfs(resolve(process.cwd(), './components'));
    let controllersPath = scanDfs(resolve(process.cwd(), './controllers'));

    for (const component of componentsPath) {
      if (parseFilterComponents.indexOf(component.route) >= 0) {
        for (const controller of controllersPath) {
          if (component.route === controller.route && component.fileName === controller.fileName) {
            components.push({
              name: component.fileName,
              componentPath: join('/components/', component.path.substr(resolve(process.cwd(), './components').length)).split('\\').join('/'),
              controllerPath: join('/controllers/', controller.path.substr(resolve(process.cwd(), './controllers').length)).split('\\').join('/'),
              componentContent: readFileSync(component.path, 'utf8'),
              controllerContent: readFileSync(controller.path, 'utf8')
            });
            break;
          }
        }
      }
    }
  }

  if (
    existsSync(resolve(process.cwd(), './services')) && statSync(resolve(process.cwd(), './services')).isDirectory()
  ) {
    let servicesPath = scanDfs(resolve(process.cwd(), './services'));

    for (const services of servicesPath) {
      if (parseFilterServices.indexOf(services.route) >= 0) {
        services.push({
          name: services.fileName,
          servicePath: join('/services/', services.path.substr(resolve(process.cwd(), './services').length)).split('\\').join('/'),
          serviceContent: readFileSync(services.path, 'utf8')
        });
      }
    }
  }

  if (existsSync(resolve(process.cwd(), './configs/index.js'))) {
    configs.index = readFileSync(resolve(process.cwd(), './configs/index.js'), 'utf8');
  } else {
    configs.index = `export default {

};`;
  }
  if (existsSync(resolve(process.cwd(), './configs/initState.js'))) {
    configs.initState = readFileSync(resolve(process.cwd(), './configs/initState.js'), 'utf8');
  } else {
    configs.initState = `export default {};`;
  }

  const virtualFiles = {
    '/__NICKELCAT_STATIC_REQUIRE.js': `module.exports = {
  components: {${
      components.map(component => `"${component.name}": {
      component:
        require("${component.componentPath}").default ||
        require("${component.componentPath}"),
      controller:
        require("${component.controllerPath}").default ||
        require("${component.controllerPath}")
      }`).join(',\n')}
  },
  services: {${
      services.map(service => `"${service.name}": {
      service:
        require("${service.servicePath}").default ||
        require("${service.servicePath}")
      }`).join(',\n')}
  },
  configs: {
    index: require('/configs/index'),
    initState: require('/configs/initState')
  }
};`,
    ...components.reduce((obj, { componentPath, componentContent }) => ({
      ...obj,
      [componentPath]: componentContent
    }), {}),
    ...components.reduce((obj, { controllerPath, controllerContent }) => ({
      ...obj,
      [controllerPath]: controllerContent
    }), {}),
    ...services.reduce((obj, { servicePath, serviceContent }) => ({
      ...obj,
      [servicePath]: serviceContent
    }), {}),
    '/configs/index.js': configs.index,
    '/configs/initState.js': configs.initState
  };
  const mfs = Volume.fromJSON(virtualFiles);
  console.log(virtualFiles);
  const fs = new Union();
  fs.use(realFs).use(mfs);
  if (!fs.join) fs.join = joinPath;

  return fs;
};
