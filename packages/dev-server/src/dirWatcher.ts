import { watch as watchFiles } from 'chokidar';

export async function dirWatcher(
  path: string,
  callback: (diffPaths: {
    path: string,
    type: 'add' | 'change' | 'unlink',
    route: string
  }[]) => Promise<void>
): Promise<void> {
  // The flag that the timer is running.
  let delayWaiting: boolean = false;
  // The flag that the files were changed when the timer was running.
  let changedDuringDelay: boolean = false;
  // The list for the files that have been changed.
  let diffList: {
    path: string,
    type: 'add' | 'change' | 'unlink',
    route: string
  }[] = [];

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
  }).on('all', async (type, filePath) => {
    if (['add', 'change', 'unlink'].indexOf(type) < 0) {
      return;
    }

    const route = /^\.?(.+)(\.[a-z]+)$/.exec(filePath
      .substr(path.length)
      .split(/[\\\/]/)
      .join('.'))[1];

    if (delayWaiting) {
      changedDuringDelay = true;
      diffList.push({
        type: type as any, path: filePath, route
      });
    }
    else {
      diffList.push({
        type: type as any, path: filePath, route
      });
      await delayUpdate();
    }
  });
};
