export const getActionEvaluator = (task, actionManager) => {
  // If this action evaluator don't provide the function at the client,
  // we should ignore this action.
  if (typeof actionManager.getServerActionExecutor(task.$$type) !== 'function') return async payload => payload;

  // Otherwise, we will create a new function that forward the parameters.
  return async (payload, tools, type) => await actionManager.getServerActionExecutor(task.$$type)(task)(payload, tools, type);
}
