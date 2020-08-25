import { watch as watchFiles } from 'chokidar';
import { EventEmitter } from 'events';

import { resolve, join } from 'path';

import { Volume } from 'memfs';
import { Union, IUnionFs } from 'unionfs';
import * as realFs from 'fs';

export async function scan(
  parseFilterComponents: string[] = ['', 'dialog.', 'dialogs.', 'page.', 'pages.', 'view.', 'views.']
): Promise<IUnionFs> {
  let components: {
    name: string,
    path: string
  }[] = [];
  let configPath: string = '';

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
    realFs.existsSync(resolve(process.cwd(), './src')) &&
    realFs.statSync(resolve(process.cwd(), './src')).isDirectory()
  ) {
    for (const component of scanDfs(resolve(process.cwd(), './src'))) {
      if (parseFilterComponents.indexOf(component.route) >= 0) {
        components.push({
          name: component.fileName,
          path: component.path.split('\\').join('\\\\')
        });
        break;
      }
    }
  }

  configPath =
    realFs.existsSync(
      resolve(process.cwd(), './nickelcat.config.ts')) &&
    resolve(process.cwd(), './nickelcat.config.ts') ||
    realFs.existsSync(
      resolve(process.cwd(), './nickelcat.config.js')) &&
    resolve(process.cwd(), './nickelcat.config.js');

  const virtualFiles = {
    [join(__dirname, './__nickelcat_staticRequire.js')]: `
module.exports = {
  components: {${
      components
        .map(component => `"${component.name}": "${component.path}"`)
        .join(',\n')
      }},
  configs: "${configPath.split('\\').join('\\\\')}"
};`,
    [join(process.cwd(), './__nickelcat_defaultClientLoader.js')]:
      `require("${
      join(__dirname, './defaultClientLoader.js').split('\\').join('\\\\')
      }")`,
    [join(process.cwd(), './__nickelcat_defaultServerLoader.js')]:
      `require("${
      join(__dirname, './defaultServerLoader.js').split('\\').join('\\\\')
      }")`
  };
  const mfs = Volume.fromJSON(virtualFiles);
  const fs = new Union();
  fs.use(realFs).use(mfs as any);
  if (typeof fs['join'] === 'undefined') {
    fs['join'] = join;
  }

  return fs;
};

export function watch(): EventEmitter {
  const emitter: EventEmitter = new EventEmitter();

  let changedDuringDelay: boolean = false;
  let delayWaiting: boolean = false;
  let initlaizeWaitDone: boolean = false;
  const delayUpdate = () => {
    delayWaiting = true;
    setTimeout(() => {
      if (changedDuringDelay) {
        changedDuringDelay = false;
        delayUpdate();
      } else {
        delayWaiting = false;
        emitter.emit('update');
      }
    }, 1000);
  };
  setTimeout(() => initlaizeWaitDone = true, 5000);

  watchFiles(process.cwd(), {
    ignored: /(node_modules)|(\.git)/
  }).on('all', async () => {
    if (!initlaizeWaitDone) {
      return;
    }
    await scan();

    if (delayWaiting) {
      changedDuringDelay = true;
    }
    else {
      delayUpdate();
    }
  });

  return emitter;
};

