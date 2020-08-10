/// <reference path="../../type.d.ts" />

import { TranslatorRetObj } from '../../factorys/webClient/togglePage';

export function translator(
  args: TranslatorRetObj,
  getContext: GetContextFuncType
): Array<ActionNormalObject<TranslatorRetObj>> {
  return [{
    kind: 'ActionNormalObject',
    platform: 'webClient',
    type: 'togglePage',
    args
  }];
};

export function executor({ generator }: TranslatorRetObj) {
  return async (payload: { [key: string]: any }, {
    getState,
    getGlobalState,
    getModelList,
    setGlobalState,
    createModel,
    destoryModel
  }: StateManager, {
    modelType,
    modelID
  }: WebClientLocalContext) => {
    const { type, initState } = generator(payload, {
      getState: () => getState(modelID),
      getGlobalState,
      getModelList,
      modelType,
      modelID
    });

    if (getGlobalState().$pageType) destoryModel(getGlobalState().$pageID);
    const pageID = createModel(type, initState);
    setGlobalState({ $pageType: type, $pageID: pageID });
    window.history.pushState(initState, '', `${type}${
      initState && typeof initState === 'object' && Object.keys(initState).length > 0 ?
        `?${
        Object.keys(initState)
          .map(key => `${key}=${
            (
              typeof initState[key] === 'object'
              || Array.isArray(initState[key])
            ) && encodeURI(JSON.stringify(initState[key]))
            || initState[key]
            }`)
          .join('&')
        }` : ''
      }`);

    return payload;
  }
}
