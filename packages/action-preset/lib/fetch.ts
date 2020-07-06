import factory from 'nickelcat/utils/actionFactory';

export default factory({
  $$type: 'fetch',
  creator: [{
    paras: ['string', 'function', 'array', 'object'],
    func: (path, translator, stream, options) => ({ path, translator, stream, options })
  },
  {
    paras: ['string', 'function', 'array'],
    func: (path, translator, stream) => ({ path, translator, stream, options: {} })
  }],
  translator: {
    client: [
      ({ path, options, translator, $$factoryId, $$catch }) => [{ path, options, translator, $$type: 'fetch', $$factoryId, $$catch }],
      ({ path, options, translator, $$factoryId, $$catch }) => [{ path, options, translator, $$type: 'fetch', $$factoryId, $$catch }]
    ],
    serverRouter: [
      ({ path, stream, options, $$factoryId }, { childStreamTranslator }) => [
        { path, serverStream: childStreamTranslator(stream), options, $$type: 'fetch', $$factoryId }
      ],
      ({ path, stream, options, $$factoryId }, { childStreamTranslator }) => [
        { path, serverStream: childStreamTranslator(stream), options, $$type: 'fetch', $$factoryId }
      ]
    ]
  },
  executor: {
    client: [({ path, options, translator }) => async (payload, {
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
      const ret = await fetch(path, {
        method: options.method || 'POST',
        headers: options.headers || {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(translator(payload, { getState, getGlobalState, getModelList, modelType, modelID })),
        credentials: 'same-origin'
      });
      return ret.json();
    },
    ({ path, options, translator }) => async (payload, {
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
      const ret = await fetch(path, {
        method: options.method || 'POST',
        headers: options.headers || {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(translator(payload, { getState, getGlobalState, getModelList, modelType, modelID })),
        credentials: 'same-origin'
      });
      return ret.json();
    }],
    serverRouter: [
      ({ path, serverStream }) => ({ execChildStream }) => ({
        http: {
          [path]: async payload => ({
            type: 'application/json',
            body: JSON.stringify(await execChildStream(serverStream)(payload.body, payload)),
            statusCode: 200
          })
        }
      }),
      ({ path, serverStream }) => ({ execChildStream }) => ({
        http: {
          [path]: async payload => ({
            type: 'application/json',
            body: JSON.stringify(await execChildStream(serverStream)(payload.body, payload)),
            statusCode: 200
          })
        }
      })
    ]
  }
});
