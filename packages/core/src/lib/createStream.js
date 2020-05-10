import { clientLog as log } from '../utils/logger';

export default (context, actionEvaluator) => {
  const createTasks = ({
    tasks,
    path
  }, extraArgs = {}) => (async payload => {
    const tags = tasks[0];

    if (tags.test && (!tags(payload, context))) {
      log(`The action ${path} has been skiped.`);
      return payload;
    }
    if (tags.loop && tags.loop.strickClock) {
      if (tags.loop.strickClock <= 10) throw new Error('You used strict timing mode, but the interval you set is too short.');
      setTimeout(tags.loop.timeOut, () => new Promise(() => createTasks({
        tags, tasks, path
      }, extraArgs)(payload)));
    }

    log('Get payload', payload);
    log('Get tasks', tasks);
    log(`The action ${path} will be executed`);
    for (let i = 1; i < tasks.length; ++i) {
      log('Middle process', tasks[i].$$type, 'at', i + 1, '/', tasks.length);
      if (!Array.isArray(tasks[i])) {
        try {
          payload = await actionEvaluator(tasks[i])(payload, {
            ...context,
            ...extraArgs
          });
          log(`The action ${path} has runned to step ${i + 1}, the payload is`, payload);
        } catch (e) {
          log(`The action ${path} was failed to execute, because`, e);
        }
      } else {
        payload = await createTasks({
          tasks: tasks[i],
          path: `${path}[${i}]`
        }, extraArgs)(payload);
        log(`The action ${path} has runned to step ${i + 1}, the payload is`, payload);
      }
    }

    if (tags.loop && !tags.loop.strickClock) {
      setTimeout(tags.loop.timeOut, () => new Promise(() => createTasks({
        tags, tasks, path
      }, extraArgs)(payload)));
    }

    return payload;
  });

  return createTasks;
};