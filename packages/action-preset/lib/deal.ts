import {
  ActionInfo,
  ActionObject,
  WebClientGlobalContext,
  WebClientLocalContext,
  NodeServerGlobalContext,
  NodeServerLocalContext
} from '../type';

type CustomFuncType = (payload: object, globalContext: object, localContext: object) => Promise<object>;

function webClientTranslator(func: CustomFuncType) {
  return {
    type: 'deal',
    args: { func }
  };
}
function nodeServerTranslator(func: CustomFuncType) {
  return {
    type: 'deal',
    args: { func }
  };
}

function webClientExecutor({ func }: { func: CustomFuncType }) {
  return async function (payload: object, globalContext: WebClientGlobalContext, localContext: WebClientLocalContext) {
    return await func.call(null, payload, globalContext, localContext);
  };
}
function nodeServerExecutor({ func }: { func: CustomFuncType }) {
  return async function (payload: object, globalContext: NodeServerGlobalContext, localContext: NodeServerLocalContext) {
    return await func.call(null, payload, globalContext, localContext);
  };
}

export default <ActionInfo> {
  translator: {
    webClient: webClientTranslator,
    nodeServer: nodeServerTranslator
  },
  executor: {
    webClient: webClientExecutor,
    nodeServer: nodeServerExecutor
  }
};
