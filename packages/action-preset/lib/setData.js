export const $ = obj => typeof obj === 'function' ? { $type: 'setData', func: obj } : { $type: 'setData', obj };

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
    setGlobalState(ret);
  } else {
    setGlobalState(task.obj);
  }
  return payload;
};
