export default {
  creator: (funcOrType, id) => {
    if (typeof funcOrType === 'function') {
      return { func: funcOrType };
    }
    else if (typeof funcOrType === 'string') {
      if (!id) throw new Error('You must provide the model id!');
      return { type: funcOrType, id };
    }
    else throw new Error('The first argument must be a function or a string!');
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
        if (!ret.type) throw new Error('You must provide the model type!');
        if (!ret.id) throw new Error('You must provide the model id!');
        destoryModel(ret.type, ret.id);
      } else {
        destoryModel(task.type, task.id)
      }
      return payload;
    }
  }
};