import { getActionEvaluator } from './streamGenerator';

import createStreamsFactory from '../lib/createStream';

export default ({ stateManager, actionManager }) => createStreamsFactory(getActionEvaluator, {
  getGlobalState: stateManager.getGlobalState,
  setGlobalState: stateManager.setGlobalState,
  getState: stateManager.getState,
  setState: stateManager.setState,
  getModelList: stateManager.getModelList,
  createModel: stateManager.createModel,
  destoryModel: stateManager.destoryModel,
  evaluateModelAction: stateManager.evaluateModelAction
}, actionManager);
