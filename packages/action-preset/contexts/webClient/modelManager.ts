/// <reference path="../../type.d.ts" />

export default (projectPackage: ProjectPackage, getContext: GetContextFuncType): ModelManager => {
  let components: { [key: string]: ComponentType } = {};

  function storageModel(modelType: string, component: ComponentType): void {
    components[modelType] = component;
  };

  for (const modelType of Object.keys(projectPackage.webClient)) {
    storageModel(modelType, projectPackage.webClient[modelType].component);
  }

  function loadComponent(type: string): ComponentType {
    return components[type];
  }

  function getModelList(): Array<string> {
    return Object.keys(components);
  }

  return Object.freeze({
    storageModel,
    loadComponent,
    getModelList
  });
};
