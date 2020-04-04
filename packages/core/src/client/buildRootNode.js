import React, { createElement, Component } from 'react';
import {
  getAllState,
  setGlobalState,
  registerListener
} from './utils/globalState';
import {
  loadComponent,
  getModelList,
  getStream
} from './utils/modelStore';
import createStream from './utils/createStream';

class Root extends Component {
  constructor() {
    super();
    this.state = getAllState();
    registerListener(this.setState.bind(this));
  }

  render() {
    return getModelList().map(
      modelType => Object.keys(this.state.modelState[modelType]).map(
        modelID => createElement(loadComponent(modelType), {
          key: `${modelType}-${modelID}`,
          ...this.state.modelState[modelType][modelID],
          ...this.state.globalState,
          ...((stream => Object.keys(stream).reduce(
            (obj, key) => ({
              ...obj,
              [key]: createStream({
                tasks: stream[key],
                path: `${modelType}[${modelID}]`
              }, {
                modelType,
                modelID
              })
            }), {}
          ))(getStream(modelType)))
        })
      )
    ).reduce((arr, item) => arr.concat(item), []);
  }
}

export default (initGlobalState = {}) => {
  setGlobalState(initGlobalState);
  return <Root />;
};
