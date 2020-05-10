export default {
  creator: (path, translator, stream, options = {}) => {
    if (typeof path !== 'string') throw new Error('You must provide a string as the path!');
    if (typeof translator !== 'function') throw new Error('You must provide a function as the translator!');
    if (!Array.isArray(stream)) throw new Error('You must provide an array as the stream!');
    if (typeof options !== 'object') throw new Error('You must provide an object as the options!');
    return { path, translator, stream, options };
  },
  translator: {
    client: ({ path, options, translator }) => ({ path, options, translator }),
    server: ({ path, stream, options }) => [{ path, $$static: stream, options }]
  },
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
      return (await fetch(task.path, {
        method: task.options.method || 'POST',
        headers: task.options.headers || {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(translator(payload, { getState, getGlobalState, getModelList, modelType, modelID })),
        credentials: 'same-origin'
      })).json();
    }
  }
};
