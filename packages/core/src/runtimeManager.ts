import {
  IRuntimeObject,
  IRuntimeFunc,
  IPlatforms
} from './index';
import {
  getPlatform,
  getContexts
} from './contextManager';

let runtimes: {
  [tag: string]: {
    [actionName: string]: (
      payload: { [key: string]: any },
      contexts: Readonly<{
        [key: string]: { [func: string]: (...args: any[]) => any }
      }>,
      variants: Readonly<{ [key: string]: any }>
    ) => Promise<{ [key: string]: any }>
  }
} = {};
let actions: {
  [key: string]: IRuntimeFunc
} = {};

export function loadRuntime(
  runtime: IRuntimeObject,
  tag: string,
  name: string
): void {
  if (typeof runtime[getPlatform()] !== 'undefined') {
    runtimes[tag][name] = runtime[getPlatform()];
  }
};

export function registerAction(
  type: string,
  runtime: { [platform in IPlatforms]?: IRuntimeFunc } | IRuntimeFunc
) {
  if (typeof runtime === 'function') {
    actions[type] = runtime;
  } else {
    if (typeof runtime[getPlatform()] !== undefined) {
      actions[type] = runtime[getPlatform()] as IRuntimeFunc;
    }
  }
}

export function getRuntimeList(tag: string): string[] {
  if (typeof runtimes[tag] === 'undefined') {
    throw new Error(`Unknown tag '${tag}' at the getPlatform() '${getPlatform()}'.`);
  }
  return Object.keys(runtimes[tag]);
}

export function hasRuntime(
  tag: string, streamName: string
): boolean {
  if (
    typeof runtimes[tag] === 'undefined' ||
    typeof runtimes[tag][streamName] === 'undefined'
  ) {
    return false;
  } else {
    return true;
  }
}

export async function runRuntime(
  tag: string,
  name: string,
  payload: { [key: string]: any },
  variants: { [key: string]: any }
): Promise<{ [key: string]: any }> {
  if (
    typeof runtimes[tag] === 'undefined' ||
    typeof runtimes[tag][name] === 'undefined'
  ) {
    throw new Error(
      `Unknown stream '${name}' from '${tag}' at the getPlatform() '${getPlatform()}'.`
    );
  }
  return await runtimes[tag][name](
    payload, getContexts(), variants
  );
};
