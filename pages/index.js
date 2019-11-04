import React from 'react';
import Head from 'next/head';

import { connect } from 'react-redux';
import actions from '../src/actions';

import classnames from "classnames";
import { makeStyles } from "@material-ui/core/styles";

import Main from "../components/views/main";

export default connect(state => ({ state }), dispatch => ({
}))(props => {
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  return ([
    <Head>
      <title>TEMPLATE</title>
      <link rel='icon' href='/favicon.ico' />
    </Head>,
    <Main />
  ]);
});
