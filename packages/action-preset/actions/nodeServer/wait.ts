import {
  ActionObject
} from '../../../core/type';
import {
  NodeServerGlobalContext,
  NodeServerLocalContext
} from "../../contexts/nodeServer/modelManager";

interface GeneratorRetObj {
  length: number
};
interface TranslatorRetObj {
  generator: (...args: any[]) => GeneratorRetObj
};
type GeneratorFunc = (payload: object, utils: NodeServerGlobalContext & NodeServerLocalContext) => GeneratorRetObj;

export function translator(func: GeneratorFunc): ActionObject<TranslatorRetObj>;
export function translator(length: number): ActionObject<TranslatorRetObj>;
export function translator(arg0: GeneratorFunc | number): ActionObject<TranslatorRetObj> {
  if (typeof arg0 === 'number') return {
    disc:'ActionObject',
    platform: 'nodeServer',
    type: 'wait',
    args: { generator: () => ({ length }) }
  }
  else return {
    disc:'ActionObject',
    platform:'nodeServer',
    type: 'wait',
    args: { generator: arg0 }
  }
};

export function executor({ generator }: TranslatorRetObj) {
  return async (payload: object, globalContext: NodeServerGlobalContext, localContext: NodeServerLocalContext) => {
    const { length } = (<GeneratorFunc>generator)
      (payload, {
        ...globalContext,
        ...localContext
      });
    return await (new Promise(resolve =>
      setTimeout(() => resolve(payload), length)
    ));
  };
};
 