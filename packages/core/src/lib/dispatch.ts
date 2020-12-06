import { IRuntimeObject } from '../index';
import { hasRuntime, runRuntime } from '../runtimeManager';
import { registerAction } from '../actionManager';

export function dispatch(
  func: (variants: { [key: string]: unknown }) => ({
    modelType: string, actionName: string, modelID: string
  })
): IRuntimeObject {
  return {
    type: '*.dispatch',
    args: { func }
  };
}

registerAction(
  '*.dispatch',
  '*',
  ({ func }: {
    func: (
      payload: { [key: string]: unknown },
      variants: { [key: string]: unknown }
    ) => ({
      modelType: string, actionName: string, modelID: string
    })
  }) => async (
    payload, variants
  ) => {
      const { modelType, actionName, modelID } = func(payload, variants);
      if (!hasRuntime(modelType, actionName)) {
        throw new Error(`Illegal path: ${modelType}.${actionName}`);
      }
      return await runRuntime(
        modelType, actionName, modelID, payload
      );
    }
);
