import React from 'react';
import App from 'next/app';

import CssBaseline from '@material-ui/core/CssBaseline';

import { Provider } from 'react-redux';
import store from '../client/store';
import { views } from '../client/connector';

export default class MyApp extends App {
  componentDidMount() {
    // Delete the preload CSS code.
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