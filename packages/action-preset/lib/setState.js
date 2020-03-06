export const $ = obj => typeof obj === 'function' ? { $type: 'setState', func: obj } : { $type: 'setState', obj };

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
    setState(modelType, modelID, ret);
  } else {
    setState(modelType, modelID, task.obj);
  }
  return payload;
};

