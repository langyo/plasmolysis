import { existsSync, readdirSync, statSync, readFileSync } from 'fs';
import { resolve, join } from 'path';

import { Volume } from 'memfs';
import { Union } from 'unionfs';
import * as realFs from 'fs';

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
              componentPath: component.path.split('\\').join('\\\\'),
              controllerPath: controller.path.split('\\').join('\\\\')
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
          servicePath: services.path.split('\\').join('\\\\')
        });
      }
    }
  }

  configs.index = existsSync(resolve(process.cwd(), './configs/index.js'));
  configs.initState = existsSync(resolve(process.cwd(), './configs/initState.js'));

  const virtualFiles = {
    [join(process.cwd(), './__nickelcat_staticRequire.js')]: `module.exports = {
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
    index: ${configs.index ? `require("${join(process.cwd(), './configs/index.js').split('\\').join('\\\\')}").default || require("${join(process.cwd(), './configs/index.js').split('\\').join('\\\\')}")` : '{}'},
    initState: ${configs.initState ? `require("${join(process.cwd(), './configs/initState.js').split('\\').join('\\\\')}").default || require("${join(process.cwd(), './configs/initState.js').split('\\').join('\\\\')}")` : '{}'}
  }
};`,
    [join(process.cwd(), './__nickelcat_defaultClientLoader.js')]: readFileSync(join(__dirname, './lib/defaultClientLoader.js'), 'utf8'),
    [join(process.cwd(), './__nickelcat_defaultServerLoader.js')]: readFileSync(join(__dirname, './lib/defaultServerLoader.js'), 'utf8'),
    [join(process.cwd(), './__nickelcat_childProcessCreator.js')]: readFileSync(join(__dirname, './lib/childProcessCreator.js'), 'utf8'),
    [join(process.cwd(), './__nickelcat_childProcessShell.js')]: readFileSync(join(__dirname, './lib/childProcessShell.js'), 'utf8')
  };
  const mfs = Volume.fromJSON(virtualFiles);
  const fs = new Union();
  fs.use(realFs).use(mfs);
  if (!fs.join) fs.join = join;

  return fs;
};
