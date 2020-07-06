import { generalControllerStreamLog as log } from 'nickelcat/utils/logger';

export default (actionEvaluator, globalContext = {}, actionManager) => {
  const createTasks = ({
    tasks,
    path
  }, taskContext = {}) => (async payload => {
    const tags = tasks[0];
    const context = {
      ...globalContext,
      ...taskContext
    };

    if (tags.test && (!tags(payload, context))) {
      log({ tasks, path, payload, status: 'skipped' });
      return payload;
    }
    if (tags.loop && tags.loop.strickClock) {
      if (tags.loop.strickClock <= 10) throw new Error('You used strict timing mode, but the interval you set is too short.');
      setTimeout(tags.loop.timeOut, () => new Promise(() => createTasks({
        tags, tasks, path
      }, context)(payload)));
    }

    log({ tasks, path, payload, status: 'begin' });
    for (let i = 1; i < tasks.length; ++i) {
      if (!Array.isArray(tasks[i])) {
        try {
          payload = await actionEvaluator(tasks[i], actionManager)(payload, context);
          log({ tasks, path, payload, status: 'success', step: i });
        } catch (errInfo) {
          log({ tasks, path, payload, status: 'fail', step: i, extraErrorInfo: errInfo });
          if (tasks[i].$$catch) return await createTasks({
            tasks: tasks[i].$$catch,
            path: `${path}[${i}]->catch`
          }, taskContext)({ prePayload: payload, errInfo });
          else return { prePayload: payload, errInfo };
        }
      } else {
        payload = await createTasks({
          tasks: tasks[i],
          path: `${path}[${i}]`
        }, taskContext)(payload);
        log({ tasks, path, payload, status: 'success', step: i });
      }
    }

    if (tags.loop && !tags.loop.strickClock) {
      setTimeout(tags.loop.timeOut, () => new Promise(() => createTasks({
        tags, tasks, path
      }, taskContext)(payload)));
    }

    return payload;
  });

  return createTasks;
};