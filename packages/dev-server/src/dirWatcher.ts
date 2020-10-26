import { watch as watchFiles } from 'chokidar';
import * as realFs from 'fs';
import { join } from 'path';

export function dirScanner(path: string = process.cwd()) {
  function dfs(path: string, route: string = '.') {
    let nodes: { path: string, route: string }[] = [];
    for (const fileName of realFs.readdirSync(path)) {
      if (realFs.statSync(join(path, fileName)).isDirectory()) {
        nodes.concat(dfs(join(path, fileName), `${route}.${fileName}`));
      }
      else if (/(\.js)|(\.mjs)|(\.ts)|(\.jsx)|(\.tsx)$/.test(fileName)) {
        nodes.push({ path: join(path, fileName), route: route.substr(1) });
      }
    }
    return nodes;
  }
  return Object.keys(realFs.readdirSync(path)).reduce((obj, key) => ({
    ...obj,
    [key]: dfs(join(path, `./${key}`))
  }), {});
}

export async function dirWatcher(
  path: string,
  callback: (diffPaths: { path: string, type: string }[]) => Promise<void>
): Promise<void> {
  // The flag that the timer is running.
  let delayWaiting: boolean = false;
  // The flag that the files were changed when the timer was running.
  let changedDuringDelay: boolean = false;
  // The list for the files that have been changed.
  let diffList: { path: string, type: string }[] = [];

  async function delayUpdate() {
    delayWaiting = true;
    setTimeout(async () => {
      if (changedDuringDelay) {
        changedDuringDelay = false;
        await delayUpdate();
      } else {
        delayWaiting = false;
        await callback(diffList);
        diffList = [];
      }
    }, 1000);
  };

  watchFiles(path, {
    ignored: /(node_modules)|(\.git)/
  }).on('all', async (type, path) => {
    if (delayWaiting) {
      changedDuringDelay = true;
      diffList.push({ type, path });
    }
    else {
      diffList.push({ type, path });
      await delayUpdate();
    }
  });
};
