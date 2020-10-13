import {
  IRuntimeObject
} from '../index';

export function test(
  testFunc: (
    payload: { [key: string]: any },
    contexts: { [key: string]: any },
    variants: { [key: string]: any }
  ) => boolean,
  task: IRuntimeObject
): IRuntimeObject {
  return (platform, publicContexts) => async (
    payload, contexts, variants
  ) => {
    if (testFunc(payload, contexts, variants)) {
      payload = await task(
        platform, publicContexts
      )(payload, contexts, variants);
    }
    return payload;
  };
}