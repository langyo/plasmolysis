import {
  WebClientGlobalContext,
  WebClientLocalContext
} from "../../contexts/webClient/modelManager";


type CustomFuncType = (payload: object, globalContext: object, localContext: object) => Promise<object>;

export function translator(func: CustomFuncType) {
  return {
    type: 'deal',
    args: { func }
  };
}

export function executor({ func }: { func: CustomFuncType }) {
  return async (payload: object, globalContext: WebClientGlobalContext, localContext: WebClientLocalContext) => {
    return await func.call(null, payload, globalContext, localContext);
  };
}
