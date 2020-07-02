import factory from 'nickelcat/utils/actionFactory';

export default factory({
  $$type: 'togglePage',
  creator: [
    { paras: ['function'], func: func => ({ func }) },
    { paras: ['string', 'string'], func: (type, initState) => ({ type, initState }) }
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
        if (getGlobalState().$pageType) destoryModel(getGlobalState().$pageType, getGlobalState().$pageID);
        const pageID = createModel(ret.type, ret.initState);
        setGlobalState({ $pageType: ret.type, $pageID: pageID });
        history.pushState(
          ret.initState, '', `${ret.type}${
        ret.initState && typeof ret.initState === 'object' && Object.keys(ret.initState).length > 0 ?
          `?${
          Object.keys(ret.initState)
            .map(key => `${key}=${
              (
                typeof ret.initState[key] === 'object'
                || Array.isArray(ret.initState[key])
              ) && encodeURI(JSON.stringify(ret.initState[key]))
              || ret.initState[key]
              }`)
            .join('&')
          }` : ''
        }`);
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
        if (getGlobalState().$pageType) destoryModel(getGlobalState().$pageType, getGlobalState().$pageID);
        const pageID = createModel(task.type, task.initState);
        setGlobalState({ $pageType: task.type, $pageID: pageID });
        history.pushState(
          task.initState, '', `${task.type}${
        task.initState && typeof ret.initState === 'object' && Object.keys(ret.initState).length > 0 ?
          `?${
          Object.keys(task.initState)
            .map(key => `${key}=${
              (
                typeof task.initState[key] === 'object'
                || Array.isArray(task.initState[key])
              ) && encodeURI(JSON.stringify(task.initState[key]))
              || task.initState[key]
              }`)
            .join('&')
          }` : ''
        }`);
        return payload;
      }
    ]
  }
});
