import { join } from 'path';

import { Volume } from 'memfs';
import { Union } from 'unionfs'
import * as realFs from 'fs';

export function staticDepsBuilder(
  parseFilterComponents: string[]
    = ['', 'dialog.', 'dialogs.', 'page.', 'pages.', 'view.', 'views.']
) {
  let components: {
    name: string,
    path: string
  }[] = [];

  const scanDfs = (path: string, route: string = '') => {
    let list: {
      fileName: string,
      path: string,
      route: string
    }[] = [];
    for (const fileName of realFs.readdirSync(path)) {
      if (realFs.statSync(join(path, fileName)).isDirectory()) {
        list = list.concat(
          scanDfs(join(path, fileName), `${route}${fileName}.`)
        );
      }
      else if (/(\.js)|(\.mjs)|(\.ts)|(\.jsx)|(\.tsx)$/.test(fileName)) {
        list.push({
          fileName: `${route}${fileName.slice(0, fileName.lastIndexOf('.'))}`,
          path: join(path, fileName),
          route
        });
      }
    }
    return list;
  }

  if (
    realFs.existsSync(join(process.cwd(), './src')) &&
    realFs.statSync(join(process.cwd(), './src')).isDirectory()
  ) {
    for (const component of scanDfs(join(process.cwd(), './src'))) {
      if (parseFilterComponents.indexOf(component.route) >= 0) {
        components.push({
          name: component.fileName,
          path: component.path.split('\\').join('\\\\')
        });
      }
    }
  }

  const configRequireSentence: string =
    realFs.existsSync(
      join(process.cwd(), './nickelcat.config.ts')
    ) && `require("${join(process.cwd(), './nickelcat.config.ts')
      .split('\\').join('\\\\')
    }")` ||
    realFs.existsSync(
      join(process.cwd(), './nickelcat.config.js')
    ) && `require("${join(process.cwd(), './nickelcat.config.js')
      .split('\\').join('\\\\')
    }")` || '{}';

  const virtualFiles = {
    [join(__dirname, './__nickelcat_staticRequire.js')]: `
module.exports = {
data: {
  webClient: {${components.map(({ name, path }) => (`
    "${name}": {
      component: require("${path}").default,
      controller: require("${path}").controller
    }`)).join(',')}},
  nodeServer: {
    http: {}
  }
},
config: ${configRequireSentence}
};`,
    [join(process.cwd(), './__nickelcat_defaultClientLoader.js')]:
      `require("${join(__dirname, './defaultClientLoader.js').split('\\').join('\\\\')
      }")`,
    [join(process.cwd(), './__nickelcat_defaultServerLoader.js')]:
      `require("${join(__dirname, './defaultServerLoader.js').split('\\').join('\\\\')
      }")`
  };

  const mfs = Volume.fromJSON(virtualFiles);
  let fs = (new Union()).use(realFs).use(mfs as any);
  if (typeof fs['join'] === 'undefined') {
    fs['join'] = join;
  }

  return fs;
}