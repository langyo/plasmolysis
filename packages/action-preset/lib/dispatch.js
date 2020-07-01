import factory from 'nickelcat/utils/actionFactory';

export default factory({
  $$type: 'dispatch',
  creator: [
    { paras: ['function'], func: func => ({ func }) },
    {
      paras: ['string', 'string', 'string', 'object'],
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
        const { type, id, action, payload: retPayload } = task.func(payload, {
          state: getState(modelType, modelID),
          getGlobalState,
          getModelList,
          getState,
          modelType,
          modelID
        });
        await evaluateModelAction(type, id, action, retPayload || payload);
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
