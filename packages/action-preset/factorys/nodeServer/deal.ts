type CustomFuncType = (
  payload: { [key: string]: any },
  globalContext: { [key: string]: any },
  localContext: { [key: string]: any }
) => Promise<{ [key: string]: any }>;
export interface TranslatorRetObj {
  func: CustomFuncType
};

export function deal(
  func: CustomFuncType
): OriginalActionObject<TranslatorRetObj> {
  return {
    platform: 'nodeServer',
    pkg: 'preset',
    type: 'deal',
    args: { func }
  };
}