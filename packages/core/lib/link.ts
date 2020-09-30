import {
  IPlatforms,
  IRuntime
} from '../index';

export function link(task: IRuntime);
export function link(platform: IPlatforms, task: IRuntime);
export function link(platform: IPlatforms, path: string);
export function link(
  arg0: IRuntime | IPlatforms,
  arg1?: IRuntime | string
): IRuntime {
  return (platform, publicContexts) => async (
    payload, contexts, variants
  ) => {
    return payload;
  };
}