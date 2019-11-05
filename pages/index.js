import React from 'react';
import Head from 'next/head';

import { connect } from 'react-redux';
import actions from '../src/actions';

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
      <title>I 笔记</title>
      <link rel='icon' href='/favicon.ico' />
    </Head>,
    <div></div>
  ]);
});
