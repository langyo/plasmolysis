import {
  ActionObject,
  NodeServerGlobalContext,
  NodeServerLocalContext
} from "../../type";

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
    type: 'wait',
    args: { generator: () => ({ length }) }
  }
  else return {
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
 