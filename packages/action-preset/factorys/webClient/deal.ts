type CustomFuncType = (payload: { [key: string]: any }, globalContext: { [key: string]: any }, localContext: { [key: string]: any }) => Promise<{ [key: string]: any }>;
export interface TranslatorRetObj {
  func: CustomFuncType
};

export default function factory(func: CustomFuncType): TranslatorRetObj {
  return { func };
}