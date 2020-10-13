import {
  IRuntimeObject,
  IRuntimeFunc,
  IRuntimeManager,
  IContextManager,
  IPlatforms,
} from './index';

export function runtimeManagerFactory(
  contextManager: IContextManager,
  platform: IPlatforms
): IRuntimeManager {
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

  function loadRuntime(
    runtime: IRuntimeObject,
    tag: string,
    name: string
  ): void {
    if (typeof runtime[platform] !== 'undefined') {
      runtimes[tag][name] = runtime[platform];
    }
  };

  function registerAction(
    type: string,
    runtime: { [platform in IPlatforms]?: IRuntimeFunc } | IRuntimeFunc
  ) {
    if (typeof runtime === 'function') {
      actions[type] = runtime;
    } else {
      if (typeof runtime[platform] !== undefined) {
        actions[type] = runtime[platform] as IRuntimeFunc;
      }
    }
  }

  function getRuntimeList(tag: string): string[] {
    if (typeof runtimes[tag] === 'undefined') {
      throw new Error(`Unknown tag '${tag}' at the platform '${platform}'.`);
    }
    return Object.keys(runtimes[tag]);
  }

  function hasRuntime(
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

  async function runRuntime(
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
        `Unknown stream '${name}' from '${tag}' at the platform '${platform}'.`
      );
    }
    return await runtimes[tag][name](
      payload, contextManager.getContexts(), variants
    );
  };

  return Object.freeze({
    loadRuntime,
    registerAction,
    getRuntimeList,
    hasRuntime,
    runRuntime
  });
};