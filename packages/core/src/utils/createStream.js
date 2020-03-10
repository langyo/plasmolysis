import {
  getGlobalState,
  setGlobalState,
  getState,
  setState,
  getModelList,
  createModel,
  destoryModel,
  evaluateModelAction
} from './globalState';
import { getActionEvaluator } from './actionCreator';
import log from './logger';

// TODO
// 我一直在担心异步调用的问题，生怕这个控制流在客户端正在执行的过程中会被同步阻塞，
// 所以我得改一下这里工作流的执行方式，例如使用 webworker 之类的
// 更确切地讲，createStream
// 可能本身是同步(为了用上
// DOM)，其中的一部分动作用上异步...
// 也可能不行

export default ({
  test: () => true,
  tasks,
  path
}, {
  modelType,
  modelID
}) => async payload => {
  if (!test(payload, getState(modelType, modelID), getGlobalState())) {
    log(`The action ${path} has been skiped.`);
    return payload;
  }
  log('Get payload', payload);
  log(`The action ${path} will be executed`);
  for (let i = 0; i < tasks.length; ++i) {
    log('Middle process', tasks[i], 'at', i, ', the total length is', tasks.length);
    if (!Array.isArray(tasks[i])) {
      try {
        payload = await getActionEvaluator(tasks[i].$type)(tasks[i])(payload, {
          setState: state => setState(modelType, modelID, state),
          getState: () => getState(modelType, modelID),
          setGlobalState,
          getGlobalState,
          getModelList,
          getOtherModelState: getState
          createModel,
          destoryModel,
          evaluateModelAction: (...args) => await evaluateModelAction(...args);
        }, {
          modelType,
          modelID
        });
        log(`The action ${path} has runned to step ${i}, the payload is`, payload);
      } catch (e) {
        log(`The action ${path} was failed to execute, because`, e);
        throw e;
      }
    } else {
      payload = await createTasks({
        test: tasks[i][0],
        tasks: tasks[i].slice(1),
        path: `${path}[${i}]`
      }, {
        modelType,
        modelID
      })(payload);
      log(`The action ${path}[${i}] has been executed.`);
    }
  }
  return payload;
};

