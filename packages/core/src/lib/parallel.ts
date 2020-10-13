import {
  IRuntimeObject
} from '../index';

export function parallel(...tasks: IRuntimeObject[]);
export function parallel(map: { [key: string]: IRuntimeObject }, key: string);
export function parallel(
  arg0: IRuntimeObject | { [key: string]: IRuntimeObject },
  arg1?: IRuntimeObject | string,
  ...tasks: IRuntimeObject[]
): IRuntimeObject {
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
      setTimeout(() => (arg1 as IRuntimeObject)(
        platform, publicContexts
      )(payload, contexts, variants), 0);
      for (const task of tasks) {
        if (typeof task !== 'undefined') {
          setTimeout(() => task(
            platform, publicContexts
          )(payload, contexts, variants), 0);
        }
      }
      return typeof arg0 !== 'undefined' ? await arg0(
        platform, publicContexts
      )(payload, contexts, variants) : payload;
    }
  };
}