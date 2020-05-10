export default {
  creator: (funcOrType, initState, name) => { 
    if (typeof funcOrType === 'function') {
      return { func: funcOrType };
    }
    else if (typeof funcOrType === 'string') {
      return {
        type: funcOrType,
        payload: initState === undefined ? {} : initState,
        name: name || null
      };
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
        createModel(ret.type, ret.initState, ret.name);
      } else {
        createModel(task.type, task.initState, task.name);
      }
      return payload;
    }
  }
};