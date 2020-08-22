/// <reference path="../../type.d.ts" />

export function modelManager(
  projectPackage: ProjectPackage,
  getContext: GetContextFuncType
): ModelManager {
  let components: { [key: string]: WebClientComponentType } = {};

  function storageModel(
    modelType: string,
    component: WebClientComponentType
  ): void {
    components[modelType] = component;
  };

  for (const modelType of Object.keys(projectPackage.webClient)) {
    storageModel(modelType, projectPackage.webClient[modelType].component);
  }

  function loadComponent(type: string): WebClientComponentType {
    return components[type];
  }

  function getModelList(): string[] {
    return Object.keys(components);
  }

  return Object.freeze({
    storageModel,
    loadComponent,
    getModelList
  });
};
