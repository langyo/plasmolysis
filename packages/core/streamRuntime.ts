/// <reference path="type.d.ts" />

import { getExecutor } from './actionManager';

interface ITasksInfo {
  tasks: Array<ActionObject>,
  path: string
}

export default (platform: Platforms, globalContext: object) => function createTasks({
  tasks,
  path
}: ITasksInfo, localContext: object) {
  return (async (payload: object): Promise<object> => {
    let isUnlimitedLoop: boolean = false;
    for (let i = 0; i < tasks.length; ++i) {
      const task = tasks[i];
      try {
        switch (task.kind) {
          case 'ActionNormalObject':
            payload = await getExecutor(platform, task.type)(tasks[i])(payload, globalContext, localContext);
            break;
          case 'ActionBridgeObject':
            throw new Error('Can\'t execute the origin bridge action.');
          case 'ActionJudgeObject':
            if (!task.cond(payload, globalContext, localContext)) return payload;
            break;
          case 'ActionSubStream':
            payload = await createTasks({
              tasks: task.stream,
              path: `${path}[${i}]`
            }, localContext)(payload);
            break;
          case 'ActionLoopTag':
            if (i !== 0) throw new Error('The loop tag must be declared on the head of the stream.');
            switch (task.mode) {
              case 'fixed':
                if (typeof task.wait === 'undefined') throw new Error('Waiting time length required.');
                if (task.wait < 50) throw new Error('The waiting time is too short.');
                setTimeout(() => createTasks({ tasks, path }, localContext)(payload));
                break;
              case 'unlimited':
                isUnlimitedLoop = true;
                break;
            }
        }
      } catch (errInfo) {
        switch (task.kind) {
          case 'ActionNormalObject':
            if (typeof task.catch !== 'undefined') return await createTasks({
              tasks: task.catch,
              path: `${path}[${i}]->catch`
            }, localContext)({ payload, errInfo });
            else return { payload, errInfo };
          default:
            return { payload, errInfo };
        }
      }
    }
    if (isUnlimitedLoop) setTimeout(() => createTasks({ tasks, path }, localContext)(payload), 0);

    return payload;
  });
};