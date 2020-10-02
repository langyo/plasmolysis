import {
  IRuntime
} from '../index';

export function series(...tasks: IRuntime[]): IRuntime {
  return (platform, publicContexts) => async (
    payload, contexts, variants
  ) => {
    for (const task of tasks) {
      if (typeof task !== 'undefined') {
        payload = await task(
          platform, publicContexts
        )(payload, contexts, variants);
      }
    }
    return payload;
  };
}