import factory from 'nickelcat/utils/actionFactory';

export default factory({
  $$type: 'setState',
  creator: [
    { paras: ['function'], func: func => ({ func }) },
    { paras: ['object'], func: obj => ({ obj }) }
  ],
  executor: {
    client: [
      task => async (payload, {
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
        let ret = task.func(payload, {
          state: getState(modelType, modelID),
          getGlobalState,
          getModelList,
          getState,
          modelType,
          modelID
        });
        setState(modelType, modelID, ret);
        return payload;
      },
      task => async (payload, {
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
        setState(modelType, modelID, task.obj);
        return payload;
      }
    ]
  }
});

