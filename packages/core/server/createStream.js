import { getActionEvaluator } from './actionCreator';

import createStreamsFactory from '../lib/createStream';

export default ({ actionManager }) => createStreamsFactory(getActionEvaluator, {}, actionManager);
