import { getActionEvaluator } from './actionCreator';

import createStreamsFactory from '../lib/createStream';

export default createStreamsFactory(getActionEvaluator);
