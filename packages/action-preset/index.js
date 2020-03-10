import creatorLoader from './creatorLoader';
import libLoader from './libLoader';

export default {
  ...creatorLoader,
  $name: 'preset',
  $evaluator: libloader
};

export {
  ...creatorLoader
};

export const $name = 'preset';
export const $evaluator = libLoader;
