import ModelManager, { ISourceComponentRequireObj } from './modelManager';

export default ({
  components
}: {
  components: ISourceComponentRequireObj
}): object => {
  const modelManager = ModelManager(components);
  return { modelManager };
}