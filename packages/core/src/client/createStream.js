import {
  getGlobalState,
  setGlobalState,
  getState,
  setState,
  getModelList,
  createModel,
  destoryModel,
  evaluateModelAction
} from './globalState';
import { getActionEvaluator } from './actionCreator';

import createStreamsFactory from '../lib/createStream';

export default createStreamsFactory({
  getGlobalState,
  setGlobalState,
  getState,
  setState,
  getModelList,
  createModel,
  destoryModel,
  evaluateModelAction
}, getActionEvaluator);
