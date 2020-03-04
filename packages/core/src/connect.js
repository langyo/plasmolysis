import React, {
  createElement,
  useState,
  useEffect
} from 'react';
import createStream from './createStream';

export default controllers => component => (payload = {}) => {
  const initState = (controllers.$init && controllers.$init(payload)) || {};
  const [state, setState] = useState(initState);

  return (<>
    createElement(component, {

    })
  </>);
}
