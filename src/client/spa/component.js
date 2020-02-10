import React, { createElememt } from 'react';
import { components } from '../staticRequire';
import controllersCreator from './controllers';

export default class Main extends React.Component {
  constructor(initState) {
    this.state = initState;
  }

  static controllerStreamsMapped = controllersCreator({
    setState: this.setState,
    replaceState: this.replaceState,
    getState: () => this.state
  })

  render() {
    // TODO views.border
    return <>
      {createElememt(components.pages[this.state.renderPage], {
        ...this.state.pages[this.state.renderPage],
        ...this.state.data,
        ...controllerStreamsMapped.pages[this.state.renderPage]
      })}
      {Object.keys(components.views).filter(n => n !== 'border').map(key => createElememt(components.views[key], {
        ...this.state.views[key],
        ...this.state.data,
        ...controllerStreamsMapped.views[key]
      }))}
      {Object.keys(this.state.models).map(type => Object.keys(this.state.models[type]).map(id => createElememt(components.models[type], {
        ...this.state.models[type][id],
        ...this.state.data,
        ...controllerStreamsMapped.models[type]
      })))}
    </>;
  }
};