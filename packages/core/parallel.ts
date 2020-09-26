import {
  IRuntime
} from './index';

export function parallel(...tasks: IRuntime[]);
export function parallel(map: { [key: string]: IRuntime }, key: string);
export function parallel(
  arg0: IRuntime | { [key: string]: IRuntime },
  arg1?: IRuntime | string,
  ...tasks: IRuntime[]
): IRuntime {
  return (platform, publicContexts) => async (
    payload, contexts, variants
  ) => {
    if (typeof arg0 === 'object') {
      for (const key of Object.keys(arg0).filter(n => n !== arg1)) {
        setTimeout(
          () => arg0[key](
            platform, publicContexts
          )(payload, contexts, variants), 0);
      }
      return await arg0[(arg1 as string)](
        platform, publicContexts
      )(payload, contexts, variants);
    } else {
      setTimeout(() => (arg1 as IRuntime)(
        platform, publicContexts
      )(payload, contexts, variants), 0);
      for (const task of tasks) {
        setTimeout(() => task(
          platform, publicContexts
        )(payload, contexts, variants), 0);
      }
      return await arg0(
        platform, publicContexts
      )(payload, contexts, variants);
    }
  };
}