export const $ = (funcOrType, initState, name) => { 
  if (typeof funcOrType === 'function') {
    return { $type: 'createModel', func: funcOrType };
  }
  else if (typeof funcOrType === 'string') {
    return {
      $type: 'createModel',
      type: funcOrType,
      payload: initState === undefined ? {} : initState,
      name
    };
  }
  else throw new Error('The first argument must be a function or a string!');
};

export const client = task => async (payload, {
  setState,
  getState,
  setGlobalState,
  getGlobalState,
  getModelList,
  getOtherModelState,
  createModel,
  destoryModel,
  evaluateModelAction
}, {
  modelType,
  modelID
}) => {
  if (task.func) {
    let ret = task.func(payload, {
      getState,
      getGlobalState,
      getModelList,
      getOtherModelState,
      modelType,
      modelID
    });
    createModel(ret.type, ret.initState, ret.name);
  } else {
    createModel(task.type, task.initState, task.name);
  }
  return payload;
};
