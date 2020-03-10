import getActions from '../actionLoader';

const actions = getActions();

export const getActionEvaluator = actionType => async (next) => {
  // If this action evaluator don't provide the function at the client,
  // we should ignore this action.
  if (!(actions[actionType] && actions[actionType].client && typeof actions[actionType].client === 'function')) return (...args) => await next(...args);

  // Otherwise, we will create a new function that forward the parameters.
  return (payload, tools, type) => await next(actions[actionType].client(payload, tools, type), tools, type);
}
