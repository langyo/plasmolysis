import { getServerActionExecutor } from '../lib/actionLoader';

export const getActionEvaluator = task => {
  // If this action evaluator don't provide the function at the client,
  // we should ignore this action.
  if (typeof getServerActionExecutor(task.$$type) !== 'function') return async payload => payload;

  // Otherwise, we will create a new function that forward the parameters.
  return async (payload, tools, type) => await getServerActionExecutor(task.$$type)(task)(payload, tools, type);
}
