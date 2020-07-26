import { existsSync, readdirSync, statSync, readFileSync } from 'fs';
import { resolve, join } from 'path';

import { Volume } from 'memfs';
import { Union } from 'unionfs';
import * as realFs from 'fs';

interface IParseOption {
  parseFilterComponents: Array<string>,
  parseFilterServices: Array<string>
};

const defaultParseOption: IParseOption = {
  parseFilterComponents: ['', 'dialog.', 'dialogs.', 'page.', 'pages.', 'view.', 'views.'],
  parseFilterServices: ['']
};

export default async ({
  parseFilterComponents,
  parseFilterServices
}: IParseOption = defaultParseOption) => {
  let components: Array<{
    name: string,
    componentPath: string,
    controllerPath: string
  }> = [];
  let services: Array<{
    name: string,
    servicePath: string
  }> = [];
  let configs: {
    index: boolean
    initState: boolean
  } = {
    index: false,
    initState: false
  };

  const scanDfs = (path: string, route: string = '') => {
    let list: Array<{
      fileName: string,
      path: string,
      route: string
    }> = [];
    for (const fileName of readdirSync(path))
      if (statSync(join(path, fileName)).isDirectory())
        list = list.concat(scanDfs(join(path, fileName), `${route}${fileName}.`));
      else if (/(\.js)|(\.mjs)|(\.ts)|(\.jsx)|(\.tsx)$/.test(fileName))
        list.push({
          fileName: `${route}${fileName.slice(0, fileName.lastIndexOf('.'))}`,
          path: join(path, fileName),
          route
        });
    return list;
  }

  if (
    existsSync(resolve(process.cwd(), './components')) && statSync(resolve(process.cwd(), './components')).isDirectory() &&
    existsSync(resolve(process.cwd(), './controllers')) &&
    statSync(resolve(process.cwd(), './controllers')).isDirectory()
  ) {
    for (const component of scanDfs(resolve(process.cwd(), './components'))) {
      if (parseFilterComponents.indexOf(component.route) >= 0) {
        for (const controller of scanDfs(resolve(process.cwd(), './controllers'))) {
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
    existsSync(resolve(process.cwd(), './services')) &&
    statSync(resolve(process.cwd(), './services')).isDirectory()
  ) {
    for (const service of scanDfs(resolve(process.cwd(), './services'))) {
      if (parseFilterServices.indexOf(service.route) >= 0) {
        services.push({
          name: service.fileName,
          servicePath: service.path.split('\\').join('\\\\')
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
    index: ${configs.index ?
        `require("${join(process.cwd(), './configs/index.js').split('\\').join('\\\\')}").default ||
       require("${join(process.cwd(), './configs/index.js').split('\\').join('\\\\')}")` : '{}'},
    initState: ${configs.initState ?
        `require("${join(process.cwd(), './configs/initState.js').split('\\').join('\\\\')}").default ||
       require("${join(process.cwd(), './configs/initState.js').split('\\').join('\\\\')}")` : '{}'}
  }
};`,
    [join(process.cwd(), './__nickelcat_defaultClientLoader.js')]: readFileSync(join(__dirname, './lib/defaultClientLoader.js'), 'utf8'),
    [join(process.cwd(), './__nickelcat_defaultServerLoader.js')]: readFileSync(join(__dirname, './lib/defaultServerLoader.js'), 'utf8')
  };
  const mfs = Volume.fromJSON(virtualFiles);
  const fs = new Union();
  fs.use(realFs).use(<any>mfs);
  if (typeof fs['join'] === 'undefined') fs['join'] = join;

  return fs;
};
