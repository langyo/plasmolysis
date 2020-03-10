import { createElement, useState } from 'react';
import {
  getAllState,
  registerListener
} from './utils/globalState';
import {
  loadComponent,
  getModelList,
  getStream
} from './utils/modelStore';
import createStream from './utils/createStream';

export default (initGlobalState = {}) => {
  const [state, setState] = useState(getAllState());
  registerListener(setState);

  return getModelList().map(
    modelType => Object.keys(state.modelState[modelType]).map(
      modelID => createElement(loadComponent(mdoelType), {
        key: `${modelType}-${modelID}`,
        ...state.modelState[modelType][modelID],
        ...state.globalState,
        ...((stream => Object.keys(stream).reduce(
          (obj, key) => createStream({
            tasks: stream[key],
            path: `${modelType}[${modelID}]`
          }),
          {}
        ))(getStream(modelType)))
      }
    )
  ).reduce((arr, item) => arr.concat(item), []);
}
