import {
  IOriginalActionObject
} from '../../type';

type CustomFuncType = (
  payload: { [key: string]: any },
  globalContext: { [key: string]: any },
  localContext: { [key: string]: any }
) => Promise<{ [key: string]: any }>;
export interface ITranslatorRetObj {
  func: CustomFuncType
};

export function deal(
  func: CustomFuncType
): IOriginalActionObject<ITranslatorRetObj> {
  return {
    platform: 'nodeServer',
    pkg: 'preset',
    type: 'deal',
    args: { func }
  };
}