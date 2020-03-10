import creatorLoader from './creatorLoader';
import libLoader from './libLoader';

export default {
  ...creatorLoader,
  $evaluator: libloader
};

export {
  ...creatorLoader
};

export const $evaluator = libLoader;
