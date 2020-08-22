import {
  IPlatforms,
  IGetContextFuncType,
  IActionObject,
  IActionManager
} from './type'

export function streamRuntime(
  platform: IPlatforms, globalContext: IGetContextFuncType
) {
  return function createTasks(
    tasks: IActionObject[],
    path: string,
    localContext: { [key: string]: any }
  ) {
    return async function (
      payload: { [key: string]: any }
    ): Promise<{ [key: string]: any }> {
      let isUnlimitedLoop: boolean = false;
      for (let i = 0; i < tasks.length; ++i) {
        const task = tasks[i];
        try {
          switch (task.kind) {
            case 'ActionNormalObject':
              payload =
                await (globalContext('actionManager') as IActionManager)
                  .getExecutor(platform, task.pkg, task.type)(tasks[i])(
                    payload, globalContext, localContext
                  );
              break;
            case 'ActionJudgeObject':
              if (!task.cond(payload, globalContext, localContext)) {
                return payload;
              }
              break;
            case 'ActionSubStream':
              payload = await createTasks(
                task.stream, `${path}[${i}]`, localContext
              )(payload);
              break;
            case 'ActionLoopTag':
              if (i !== 0) {
                throw new Error('The loop tag must be declared on the head of the stream.');
              }
              switch (task.mode) {
                case 'fixed':
                  if (typeof task.wait === 'undefined') {
                    throw new Error('Waiting time length required.');
                  }
                  if (task.wait < 50) {
                    throw new Error('The waiting time is too short.');
                  }
                  setTimeout(() => createTasks(
                    tasks, path, localContext
                  )(payload));
                  break;
                case 'unlimited':
                  isUnlimitedLoop = true;
                  break;
              }
          }
        } catch (errInfo) {
          switch (task.kind) {
            case 'ActionNormalObject':
              if (typeof task.catch !== 'undefined') {
                return await createTasks(
                  task.catch, `${path}[${i}]->catch`, localContext
                )({ payload: payload, errInfo });
              }
              else {
                return { payload: payload, errInfo };
              }
            default:
              return { payload: payload, errInfo };
          }
        }
      }
      if (isUnlimitedLoop) {
        setTimeout(
          () => createTasks(tasks, path, localContext)(payload), 0
        );
      }

      return payload;
    };
  };
};