import React from 'react';
import App from 'next/app';

import CssBaseline from '@material-ui/core/CssBaseline';

import { Provider } from 'react-redux';
import store from '../src/store';
import { views } from '../src/connector';

export default class MyApp extends App {
  componentDidMount() {
    // 删除服务端预加载的 CSS
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <React.Fragment>
        <Provider store={store}>
          {views.border && React.createElement(views.border, {
            children: <>
              <CssBaseline />
              <Component {...pageProps} />
            </>
          })}
          {!views.border && <>
            <CssBaseline />
            <Component {...pageProps} />
          </>}
        </Provider>
      </React.Fragment>
    );
  }
}