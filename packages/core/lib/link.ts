import {
  IRuntime
} from '../index';

export function link(path: string, task: IRuntime);
// TODO - Support the other languages' link bridge.
// export function link(platform: IPlatforms, path: string, task: IRuntime);
// export function link(platform: IPlatforms, path: string);
export function link(
  path: string,
  task: IRuntime
): IRuntime {
  return (platform, { runtimeManager, glueManager }) => {
    if (platform === 'js.node') {
      runtimeManager.loadRuntime(task, 'http', path);
      return undefined;
    }
    if (platform === 'js.browser') {
      return async (
        payload, contexts, variants
      ) => {
        return await glueManager.linkTo('js.node', path, payload);
      };
    }
    return undefined;
  };
}