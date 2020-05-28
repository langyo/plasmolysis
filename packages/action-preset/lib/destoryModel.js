import factory from 'nickelcat/utils/actionFactory';

export default factory({
  $$type: 'destoryModel',
  creator: [
    { paras: ['function'], func: func => ({ func }) },
    { paras: ['string', 'string'], func: (type, id) => ({ type, id }) }
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
        if (!ret.type) throw new Error('You must provide the model type!');
        if (!ret.id) throw new Error('You must provide the model id!');
        destoryModel(ret.type, ret.id);
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
        destoryModel(task.type, task.id)
        return payload;
      }
    ]
  }
});
