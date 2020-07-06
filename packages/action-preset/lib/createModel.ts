import factory from 'nickelcat/utils/actionFactory';

export default factory({
  $$type: 'createModel',
  creator: [
    {
      paras: ['function'],
      func: func => ({ func })
    },
    {
      paras: ['string', 'object', 'string'],
      func: (type, initState, name) => ({
        type: type,
        payload: initState === undefined ? {} : initState,
        name: name || null
      })
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
        createModel(ret.type, ret.initState, ret.name);
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
        createModel(task.type, task.initState, task.name);
        return payload;
      }
    ]
  }
});
