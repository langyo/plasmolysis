import { getActions } from '../actionLoader';

const actions = getActions();

export const getActionEvaluator = task => {
  // If this action evaluator don't provide the function at the client,
  // we should ignore this action.
  if (!(actions[task.$type] && actions[task.$type].client && typeof actions[task.$type].client === 'function')) return async payload => payload;

  // Otherwise, we will create a new function that forward the parameters.
  return async (payload, tools, type) => await actions[task.$type].client(task)(payload, tools, type);
}
