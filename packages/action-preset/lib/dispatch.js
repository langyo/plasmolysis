import factory from 'nickelcat/utils/actionFactory';

export default factory({
  $$type: 'dispatch',
  creator: [
    { paras: ['function'], func: func => ({ func }) },
    {
      paras: ['string', 'string', 'string', 'string'],
      func: (type, id, action, payload) =>
        ({ type, id, action, payload })
    }
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
        await evaluateModelAction(ret.type, ret.id, ret.action, ret.payload);
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
        await evaluateModelAction(task.type, task.id, task.action, task.payload || payload);
        return payload;
      }
    ]
  }
});
