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
    if (!ret.type) throw new Error('You must provide the model type!');
    if (!ret.id) throw new Error('You must provide the model id!');
    destoryModel(ret.type, ret.id);
  } else {
    destoryModel(task.type, task.id)
  }
  return payload;
};
