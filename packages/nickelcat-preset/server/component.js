import React, { createElement } from 'react';
import { requirePackage, getPackages } from './watcher';

export default class SSRMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.initState;
  }

  render() {
    // TODO views.border
    return <>
      {createElement(requirePackage(`components.pages.${this.state.renderPage}`), {
        ...this.state.pages[this.state.renderPage],
        ...this.state.data
      })}
      {Object.keys(getPackages().components.views).filter(n => n !== 'border').map(key => createElement(requirePackage(`components.views.${key}`), {
        ...this.state.views[key],
        ...this.state.data
      }))}
    </>;
  }
};
