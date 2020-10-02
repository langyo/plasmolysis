import { watch as watchFiles } from 'chokidar';

export async function dirWatcher(callback: () => Promise<void>): Promise<void> {
  let changedDuringDelay: boolean = false;
  let delayWaiting: boolean = false;

  async function delayUpdate() {
    delayWaiting = true;
    setTimeout(async () => {
      if (changedDuringDelay) {
        changedDuringDelay = false;
        await delayUpdate();
      } else {
        delayWaiting = false;
        await callback();
      }
    }, 1000);
  };

  watchFiles(process.cwd(), {
    ignored: /(node_modules)|(\.git)/
  }).on('all', async () => {
    if (delayWaiting) {
      changedDuringDelay = true;
    }
    else {
      await delayUpdate();
    }
  });
};

