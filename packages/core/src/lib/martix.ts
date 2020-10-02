import {
  IRuntime,
  IPlatforms
} from '../index';

export function martix(
  map: (platform: IPlatforms) => (
    payload: { [key: string]: any },
    contexts: Readonly<{
      [key: string]: {
        [func: string]: (...args: any[]) => any
      }
    }>,
    variants: Readonly<{ [key: string]: any }>
  ) => { [key: string]: IRuntime },
  key?: string
): IRuntime {
  return (platform, publicContexts) => async (
    payload, contexts, variants
  ) => {
    const factory = map(platform);
    if (typeof factory !== 'undefined') {
      const mapped = factory(payload, contexts, variants);
      if (typeof mapped[key] !== 'undefined') {
        for (const name of Object.keys(mapped).filter(n => n !== key)) {
          setTimeout(() => mapped[name](
            platform, publicContexts
          )(payload, contexts, variants), 0);
        }
        return await mapped[key](
          platform, publicContexts
        )(payload, contexts, variants);
      }
      else {
        for (const name of Object.keys(mapped)) {
          setTimeout(() => mapped[name](
            platform, publicContexts
          )(payload, contexts, variants), 0);
        }
        return payload;
      }
    }
    else {
      return payload;
    }
  };
}