import React, {
  createElement,
  useState
} from 'react';
import { generate } from 'shortid';

import createStream from './utils/createStream';
import { storageModel } from './utils/modelStore';
import { getState, registerListener } from './utils/globalState';

export default controllers => (component, modelType = generate()) => {
  const ret = (payload = {}, id = generate()) => {
    const initState = (controllers.$init && controllers.$init(payload)) || {};
    const [state, setState] = useState(initState);
    registerListener(modelType, null, setState);
    // TODO 这个函数和 register 函数似乎必须分清界限，connect
    // 只负责绑定注册，register 用于建立一个新的可用的 model 且具有自己的 modelID
    // register 函数创建 model 时，依赖的 createModel 的返回值必须是新 model 的
    // ID
    // 另外，register 直接创建一个可用的 react element，而 connect
    // 提供的则是一个工厂函数，传入一个 id 和一个 payload，同样也可以建立一个
    // react element
    // 仔细想了好久，为了显示那些由 model
    // 建立的 model，仍然需要全局渲染组件
  
    return (<>
      createElement(component, {
  
      })
    </>);
  };

  storageModel(modelType, controllers, ret);

  return ret;
}
