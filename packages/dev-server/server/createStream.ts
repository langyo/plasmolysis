import { getActionEvaluator } from './actionCreator';

import createStreamsFactory from 'nickelcat/createStream';

export default ({ actionManager }) => createStreamsFactory(getActionEvaluator, {}, actionManager);
