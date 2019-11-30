import React from 'react';
import Head from 'next/head';

import { connect } from 'react-redux';

import configs from '../configs/config';
import { pages, models, views } from '../src/connector';
import { initState } from '../src/thunks';

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
      <title>{
        typeof configs.title === 'string' ?
          configs.title :
          typeof configs.title[props.renderPage] === 'string' ?
            configs.title[props.renderPage] :
            configs.title[props.renderPage](props.pages[props.renderPage])
      }</title>
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

Index.getInitialProps = async ({ query, req, asPath }) => {
  const isServer = !process.browser;
  let pageName = asPath === '/' ? configs.initPage : asPath.split('?')[0].slice(1);
  let pageData = await (await (isServer ? require('node-fetch') : fetch)(
    `${req.protocol}://${isServer ? 'localhost' : req.hostname}/preload/${pageName}`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.cookies)
    })).json();
  console.log(pageData)

  return {
    renderPage: pageName,
    renderPageParams: query,
    data: {
      cookies: req.cookies
    },
    headers: req.headers,
    pages: {
      [pageName]:{
        ...pageData,
        ...initState.pages[pageName]
      },
      ...initState.pages
    },
    ...initState
  };
};

export default Index;