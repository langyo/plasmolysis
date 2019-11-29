import React from 'react';
import Head from 'next/head';

import { connect } from 'react-redux';

import configs from '../configs/config';
import { pages, models, views } from '../src/connector';

let Index = connect(state => state)(props => {
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  let modelsDealed = models();
  console.log(props);

  return ([
    <Head>
      <title>{configs.title}</title>
      <link rel='icon' href={configs.icon} />
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

Index.getInitialProps = async ({ pathname, query, req }) => {
  return {
    renderPage: pathname === '/' ? configs.initPage : pathname.slice(1),
    renderPageParams: query,
    headers: req.headers
  };
};

export default Index;