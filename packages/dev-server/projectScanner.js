import { existsSync, readdirSync, statSync } from 'fs';
import { resolve, join } from 'path';

export default async (parseOption = {
  parseFilterComponents: ['', 'dialog.'],
  parseFilterServices: ['']
}) => {
  let {
    parseFilterComponents,
    parseFilterServices
  } = parseOption;

  let components = [];

  const scanDfs = (path, route = '') => {
    let list = [];
    for (let fileName of readdirSync(path))
      if (statSync(join(path, fileName)).isDirectory())
        list = list.concat(scanDfs(join(path, fileName), `${route}${fileName}.`));
      else if (/(\.js)|(\.mjs)|(\.ts)|(\.jsx)|(\.tsx)$/.test(fileName))
        list.push({ fileName: `${route}${fileName.slice(0, fileName.lastIndexOf('.'))}`, path: join(path, fileName), route });
    return list;
  }

  let services = [];

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
              componentPath: component.path,
              controllerPath: controller.path
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
          servicePath: services.path
        });
      }
    }
  }
  
  return `module.exports = {
  components: {${
    components.map(component => `"${component.name}": {
      component: require("${component.componentPath.split('\\').join('\\\\')}"),
      controller: require("${component.controllerPath.split('\\').join('\\\\')}")
    }`).join(',\n')}
  },
  services: {${
    services.map(service => `"${service.name}": {
      service: require("${service.servicePath.split('\\').join('\\\\')}")
    }`).join(',\n')}
  }
};`;
};
