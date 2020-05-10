import { generate } from 'shortid';
import { createModel } from './globalState';

export default (modelType, payload = {}, id = generate()) =>
  createModel(modelType, payload, id);
