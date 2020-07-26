import {
  ActionNormalObject
} from '../../../core/type';
import {
  NodeServerGlobalContext,
  NodeServerLocalContext
} from "../../contexts/nodeServer/modelManager";

type CustomFuncType = (payload: object, globalContext: object, localContext: object) => Promise<object>;
interface TranslatorRetType {
  func: CustomFuncType
};

export function translator(func: CustomFuncType): ActionNormalObject<TranslatorRetType> {
  return {
    kind: 'ActionNormalObject',
    platform: 'nodeServer',
    type: 'deal',
    args: { func }
  };
}

export function executor({ func }: TranslatorRetType) {
  return async (payload: object, globalContext: NodeServerGlobalContext, localContext: NodeServerLocalContext) => {
    return await func.call(null, payload, globalContext, localContext);
  };
}
