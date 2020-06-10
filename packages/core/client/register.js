import { generate } from 'shortid';
import { createModel } from './stateManager';

export default (modelType, payload = {}, id = generate()) =>
  createModel(modelType, payload, id);
