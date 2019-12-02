import React from 'react';
import Head from 'next/head';

import { connect } from 'react-redux';

import configs from '../configs/config';
import { pages, models, views } from '../src/connector';

class Index extends React.Component {
  static async getInitialProps({ query, req, asPath }) {
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

    return {
      renderPage: pageName,
      pageParams: query,
      cookies: req.cookies,
      headers: req.headers,
      pageData
    };
  };

  componentDidMount() {
    const { cookies, headers, renderPage, pageParams, pageData } = this.props;
    this.props.dispatch({ type: 'framework.updateState', payload: {
      data: {
        cookies, headers, pageParams
      },
      pages: {
        [renderPage]: {
          ...pageData
        }
      },
      hasInitialized: true
    }});
  }

  render() {
    let modelsDealed = models();

    return ([
      <Head>
        <title>{
          typeof configs.title === 'string' ?
            configs.title :
            typeof configs.title[this.props.renderPage] === 'string' ?
              configs.title[this.props.renderPage] :
              configs.title[this.props.renderPage](this.props.pages[this.props.renderPage])
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
        {React.createElement(pages[this.props.renderPage], this.props.hasInitialized ? { key: this.props.renderPage } : { key: this.props.renderPage, ...this.props.pageData })}
      </>
    ]);
  }
}

export default connect(state => state)(Index);