import React, {
  createElement,
  useState
} from 'react';
import { generate } from 'shortid';

import createStream from './utils/createStream';
import { storageModel } from './utils/modelStore';
import { getState, registerUpdateListener } from './utils/globalState';

export default controllers => (component, modelType = generate()) => {
  const ret = (payload = {}) => {
    const initState = (controllers.$init && controllers.$init(payload)) || {};
    const [state, setState] = useState(initState);
    registerUpdateListener(modelType);
  
    return (<>
      createElement(component, {
  
      })
    </>);
  };

  storageModel(modelType, controllers, ret);

  return ret;
}
