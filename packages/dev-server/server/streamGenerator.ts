import { getActionEvaluator } from './serviceBridge';

import createStreamsFactory from 'nickelcat/createStream';

export default ({ actionManager }) => createStreamsFactory(getActionEvaluator, {}, actionManager);
