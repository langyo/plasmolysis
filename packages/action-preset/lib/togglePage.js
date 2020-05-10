export default {
  creator: (typeOrFunc, initState = {}) =>
    typeof typeOrFunc === 'function' ?
      { func: typeOrFunc } :
      { type: typeOrFunc, initState },
  executor: {
    client: task => async (payload, {
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
      if (task.func) {
        let ret = task.func(payload, {
          state: getState(modelType, modelID),
          getGlobalState,
          getModelList,
          getState,
          modelType,
          modelID
        });
        if (getGlobalState().$page) destoryModel(getGlobalState().$page, '$page');
        createModel(ret.type, ret.initState, '$page');
        setGlobalState({ $page: ret.type });
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
      } else {
        if (getGlobalState().$page) destoryModel(getGlobalState().$page, '$page');
        createModel(task.type, task.initState, '$page');
        setGlobalState({ $page: task.type });
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
      }
      return payload;
    }
  }
};
