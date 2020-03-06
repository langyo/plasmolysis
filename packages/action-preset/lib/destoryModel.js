export const $ = (funcOrType, id) => {
  if (typeof funcOrType === 'function') {
    return { $type: 'destoryModel', func: funcOrType };
  }
  else if (typeof funcOrType === 'string') {
    if (!id) throw new Error('You must provide the model id!');
    return { $type: 'destoryModel', type: funcOrType, id };
  }
  else throw new Error('The first argument must be a function or a string!');
}

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
