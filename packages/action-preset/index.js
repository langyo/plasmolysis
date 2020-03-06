import * as deal from './lib/deal';
import * as wait from './lib/wait';
import * as setState from './lib/setState';
import * as setData from './lib/setData';
import * as createModel from './lib/createModel';
import * as destoryModel from './lib/destoryModel';
import * as dispatch from './lib/dispatch';

export default {
  deal: deal.$,
  wait: wait.$,
  setState: setState.$,
  setData: setData.$,
  createModel: createModel.$,
  destoryModel: destoryModel.$,
  dispatch: dispatch.$,

  $evaluator: {
    deal,
    wait,
    setState,
    setData,
    createModel,
    destoryModel,
    dispatch
  }
};
