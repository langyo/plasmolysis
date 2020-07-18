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
      return payload;
    }
    
    for (let i = 1; i < tasks.length; ++i) {
      if (!Array.isArray(tasks[i])) {
        try {
          payload = await actionEvaluator(tasks[i], actionManager)(payload, context);
        } catch (errInfo) {
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
      }
    }

    return payload;
  });

  return createTasks;
};