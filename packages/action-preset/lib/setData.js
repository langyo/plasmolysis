export default {
  creator: obj => typeof obj === 'function' ?
    { func: obj } :
    { obj },
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
        setGlobalState(ret);
      } else {
        setGlobalState(task.obj);
      }
      return payload;
    }
  }
};
