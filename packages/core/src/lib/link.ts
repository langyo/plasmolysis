import { IPlatforms, IRuntimeObject } from '../index';
import { loadRuntime } from '../runtimeManager';
import { registerAction } from '../actionManager';
import { linkTo } from '../linkManager';

export function link(
  platform: IPlatforms,
  path: string,
  task?: IRuntimeObject
): IRuntimeObject {
  return {
    type: '*.link',
    args: { platform, path, task }
  };
}

registerAction(
  '*.link',
  'js.node',
  ({ path, task }: {
    platform: IPlatforms, path: string, task: IRuntimeObject
  }) => {
    loadRuntime(task, 'http', path);
    return async (payload, variants) => payload;
  }
);

registerAction(
  '*.link',
  'js.browser',
  ({ platform, path }: {
    platform: IPlatforms, path: string, task: IRuntimeObject
  }) => async (payload, variants) => {
    return await linkTo(platform, path, payload);
  }
);
