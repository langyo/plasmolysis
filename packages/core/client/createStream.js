import { getActionEvaluator } from './actionCreator';

import createStreamsFactory from '../lib/createStream';

export default stateManager => createStreamsFactory(getActionEvaluator, {
  getGlobalState: stateManager.getGlobalState,
  setGlobalState: stateManager.setGlobalState,
  getState: stateManager.getState,
  setState: stateManager.setState,
  getModelList: stateManager.getModelList,
  createModel: stateManager.createModel,
  destoryModel: stateManager.destoryModel,
  evaluateModelAction: stateManager.evaluateModelAction
});
