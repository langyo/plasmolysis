export const $ = (funcOrType, id, action, payload) => {
  if (typeof funcOrType === 'function') {
    return { $type: 'dispatch', func: funcOrType };
  } else {
    return { $type: 'dispatch', type: funcOrType, id, action, payload };
  }
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
    await evaluateModelAction(ret.type, ret.id, ret.action, ret.payload);
  } else {
    await evaluateModelAction(task.type, task.id, task.action, task.payload ||  payload);
  }
  return payload;
};
