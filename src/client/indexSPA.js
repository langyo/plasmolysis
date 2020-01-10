import React from 'react';
import { connect, Provider } from 'react-redux';

import { configs } from '../staticRequire';
import store from './store';
import { pages, models, views } from './connector';
import { initState } from './thunks';

// TODO: 待改造
class Index extends React.Component {
  componentDidMount() {
    // Delete the preload CSS code.
    const jssStyles = document.removeChild(document.querySelector('#nicklecat-jss-styles'));
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    let modelsDealed = models();

    return (<>
      <Provider store={window.__store}>
        {this.props.hasInitialized && [
          <>
            {Object.keys(views).map((n, key) => n === 'border' ? null : React.createElement(views[n], { key }))}
          </>,
          <>
            {Object.keys(modelsDealed).map(component =>
              Object.keys(modelsDealed[component]).map(id =>
                React.createElement(modelsDealed[component][id], { key: id })
              )
            ).reduce((prev, next) => prev.concat(next), [])}
          </>,
          <>
            {React.createElement(pages[this.props.renderPage], this.props.hasInitialized ? { key: this.props.renderPage } : { key: this.props.renderPage, ...this.props.pageData })}
          </>
        ]}
      </Provider>
    </>);
  }
}

export default required => connect(state => state)(Index);