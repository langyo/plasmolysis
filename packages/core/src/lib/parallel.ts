import { IRuntimeObject } from '../index';
import { runAction, registerAction } from '../runtimeManager';

export function parallel(...tasks: IRuntimeObject[]): IRuntimeObject;
export function parallel(
  reducer: (
    payload: { [key: string]: any }, reduced: { [key: string]: any }
  ) => { [key: string]: any },
  ...tasks: IRuntimeObject[]
): IRuntimeObject;
export function parallel(
  reducer: ((
    payload: { [key: string]: any }, reduced: { [key: string]: any }
  ) => { [key: string]: any }) | IRuntimeObject,
  ...tasks: IRuntimeObject[]
): IRuntimeObject {
  return {
    type: '*.parallel',
    args: typeof reducer === 'function' ?
      { reducer, tasks } :
      {
        reducer: (payload, reduced) => ({ ...reduced, ...payload }),
        tasks: [reducer, ...tasks]
      }
  };
}

registerAction(
  '*.parallel',
  '*',
  ({ tasks, reducer }: {
    tasks: IRuntimeObject[],
    reducer: ((
      payload: { [key: string]: any }, reduced: { [key: string]: any }
    ) => { [key: string]: any })
  }) => (payload, variants) => {
    return new Promise((resolve, reject) => {
      let reduced = {};
      let count = 0;
      for (const task of tasks) {
        if (typeof task !== 'undefined') {
          setTimeout(async () => {
            try {
              reduced = reducer(await runAction(
                task.type, task.args, payload, variants
              ), reduced);
            } catch (e) {
              reject(e);
            }
            count += 1;
            if (count === tasks.length) {
              resolve(reduced);
            }
          }, 0);
        }
      }
    });
  }
)
