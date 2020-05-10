export default {
  creator: (funcOrType, id, action, payload) => {
    if (typeof funcOrType === 'function') {
      return { func: funcOrType };
    } else {
      return { type: funcOrType, id, action, payload };
    }
  },
  executor: {
    client: task => async (payload, {
      setState,
      getState,
      setGlobalState,
      getGlobalState,
      getModelList,
      createModel,
      destoryModel,
      evaluateModelAction,
      modelType,
      modelID
    }) => {
      if (task.func) {
        let ret = task.func(payload, {
          state: getState(modelType, modelID),
          getGlobalState,
          getModelList,
          getState,
          modelType,
          modelID
        });
        await evaluateModelAction(ret.type, ret.id, ret.action, ret.payload);
      } else {
        await evaluateModelAction(task.type, task.id, task.action, task.payload ||  payload);
      }
      return payload;
    }
  }
};
