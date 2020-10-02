import {
  IProjectPackage,
  IRuntime,
  IRuntimeManager,
  IContextManager,
  IGlueManager,
  IPlatforms,
} from './index';

export function runtimeManagerFactory(
  projectPackage: IProjectPackage,
  contextManager: IContextManager,
  glueManager: IGlueManager,
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

  function loadRuntime(
    runtime: IRuntime,
    tag: string,
    name: string
  ): void {
    runtimes[tag][name] = runtime(platform, Object.freeze({
      contextManager,
      glueManager,
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
    loadPackage,
    getRuntimeList,
    hasRuntime,
    runRuntime
  });
};