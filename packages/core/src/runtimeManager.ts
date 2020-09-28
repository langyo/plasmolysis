import {
  IProjectPackage,
  IRuntime,
  IRuntimeManager,
  IContextManager,
  IPlatforms,
} from '../index';

export function runtimeManager(
  projectPackage: IProjectPackage,
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
      ) => { [key: string]: any }
    }
  } = {};

  function loadRuntime(
    runtime: IRuntime,
    tag: string,
    name: string
  ): void {
    runtimes[tag][name] = runtime(platform, Object.freeze({
      contextManager,
      runtimeManager: Object.freeze({
        loadRuntime,
        loadPackage,
        getRuntimeList,
        hasRuntime,
        runRuntime
      })
    }));
  };

  function loadPackage(projectPackage: IProjectPackage): void {
    if (
      typeof projectPackage.data !== 'undefined' &&
      typeof projectPackage.data.webClient !== 'undefined'
    ) {
      for (const tag of Object.keys(projectPackage.data.webClient)) {
        for (const streamName of
          Object.keys(projectPackage.data.webClient[tag].controller)
        ) {
          // The extra compare and rewrite should be exported as the interfaces.
          if (streamName === 'init') {
            loadRuntime(() => async () => ({}), tag, 'init');
          } else if (streamName === 'preload') {
            loadRuntime(() => async () => ({}), tag, 'preload');
          } else {
            loadRuntime(
              projectPackage.data.webClient[tag].controller[streamName],
              tag, streamName
            );
          }
        }
      }
    }
  }

  loadPackage(projectPackage);

  function getRuntimeList(platform: IPlatforms, tag: string): string[] {
    if (typeof runtimes[platform][tag] === 'undefined') {
      throw new Error(`Unknown tag '${tag}' at the platform '${platform}'.`);
    }
    return Object.keys(runtimes[platform][tag]);
  }

  function hasRuntime(
    platform: IPlatforms, tag: string, streamName: string
  ): boolean {
    if (
      typeof runtimes[platform][tag] === 'undefined' ||
      typeof runtimes[platform][tag][streamName] === 'undefined'
    ) {
      return false;
    } else {
      return true;
    }
  }

  function runRuntime(
    platform: IPlatforms,
    tag: string,
    name: string,
    payload: { [key: string]: any },
    variants: { [key: string]: any }
  ): { [key: string]: any } {
    if (
      typeof runtimes[platform][tag] === 'undefined' ||
      typeof runtimes[platform][tag][name] === 'undefined'
    ) {
      throw new Error(
        `Unknown stream '${name}' from '${tag}' at the platform '${platform}'.`
      );
    }
    return runtimes[tag][name](
      payload, contextManager.getContexts(), variants
    );
  };

  return Object.freeze({
    loadRuntime,
    loadPackage,
    getRuntimeList,
    hasRuntime,
    runRuntime
  });
};