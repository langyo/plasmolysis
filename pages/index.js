import React from 'react';
import Head from 'next/head';

import { connect } from 'react-redux';

import { pages, models, views } from '../src/connector';

export default connect(state => state)(props => {
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  let modelsDealed = models();

  return ([
    <Head>
      <title>I 笔记</title>
      <link rel='icon' href='/favicon.ico' />
    </Head>,
    <>
      {Object.keys(views).map((n, key) => React.createElement(views[n], { key }))}
    </>,
    <>
      {Object.keys(modelsDealed).map(component =>
        Object.keys(modelsDealed[component]).map(id =>
          React.createElement(modelsDealed[component][id], { key: id })
        )
      ).reduce((prev, next) => prev.concat(next), [])}
    </>,
    <>
      {React.createElement(pages[props.renderPage], { key: props.renderPage })}
    </>
  ]);
});
