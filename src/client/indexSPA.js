import React from 'react';
import { connect, Provider } from 'react-redux';

import { configs } from '../staticRequire';
import store from './store';
import { pages, models, views } from './connector';
import { initState } from './thunks';


return (<>
  <Provider store={window.__store}>
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
  </Provider>
</>)