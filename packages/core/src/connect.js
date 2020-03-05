import React, {
  createElement,
  useEffect
} from 'react';
import { generate } from 'shortid';

import createStream from './utils/createStream';
import { storageModel } from './utils/modelStore';

export default controllers => (component, modelType = generate()) => {
  const ret = (payload = {}) => {
    const initState = (controllers.$init && controllers.$init(payload)) || {};
  
    return (<>
      createElement(component, {
  
      })
    </>);
  };

  storageModel(modelType, controllers, ret);

  return ret;
}
