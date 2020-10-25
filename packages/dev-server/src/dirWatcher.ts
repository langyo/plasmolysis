import { watch as watchFiles } from 'chokidar';
import * as realFs from 'fs';
import { join } from 'path';

export interface INode {
  [key: string]: string | INode
};

export function dirScanner(path: string): INode {
  let nodes: INode = {};
  for (const fileName of realFs.readdirSync(path)) {
    if (realFs.statSync(join(path, fileName)).isDirectory()) {
      nodes[fileName.substr(fileName.lastIndexOf('.'))] =
        dirScanner(join(path, fileName));
    }
    else if (/(\.js)|(\.mjs)|(\.ts)|(\.jsx)|(\.tsx)$/.test(fileName)) {
      nodes[fileName.substr(fileName.lastIndexOf('.'))] =
        join(path, fileName);
    }
  }
  return nodes;
}

export async function dirWatcher(
  path: string, callback: (diffPaths: string[]) => Promise<void>
): Promise<void> {
  // The flag that the timer is running.
  let delayWaiting: boolean = false;
  // The flag that the files were changed when the timer was running.
  let changedDuringDelay: boolean = false;
  // The list for the files that have been changed.
  let diffList: string[] = [];

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
  }).on('all', async (_event, path) => {
    if (delayWaiting) {
      changedDuringDelay = true;
      diffList.push(path);
    }
    else {
      diffList.push(path);
      await delayUpdate();
    }
  });
};
