import React, {
  createElement,
  useState,
  useEffect
} from 'react';
import { generate } from 'shortid';

import createStream from './utils/createStream';

export default controllers => (component, type = generate()) => (payload = {}) => {
  const initState = (controllers.$init && controllers.$init(payload)) || {};
  const [state, setState] = useState(initState);

  return (<>
    createElement(component, {

    })
  </>);
}
