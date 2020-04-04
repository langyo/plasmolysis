import creatorLoader, {
  deal,
  wait,
  setState,
  setData,
  createModel,
  destoryModel,
  dispatch
} from './creatorLoader';
import libLoader from './libLoader';

export default {
  ...creatorLoader,
  $name: 'preset',
  $evaluator: libLoader
};

export {
  deal,
  wait,
  setState,
  setData,
  createModel,
  destoryModel,
  dispatch
};

export const $name = 'preset';
export const $evaluator = libLoader;
