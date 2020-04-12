import creatorLoader, {
  deal,
  wait,
  setState,
  setData,
  createModel,
  destoryModel,
  dispatch,
  togglePage
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
  dispatch,
  togglePage
};

export const $name = 'preset';
export const $evaluator = libLoader;
