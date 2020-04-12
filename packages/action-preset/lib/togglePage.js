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
    if (getGlobalState().$page) destoryModel(getGlobalState().$page, '$page');
    createModel(ret.type, ret.initState, '$page');
    setGlobalState({ $page: ret.type });
  } else {
    if (getGlobalState().$page) destoryModel(getGlobalState().$page, '$page');
    createModel(task.type, task.initState, '$page');
    setGlobalState({ $page: task.type });
  }
  return payload;
};

