import React from 'react';
import { connect, Provider } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';

import { configs } from '../utils/staticRequire';
import store from './store';
import { pages, models, views } from './connector';
import { initState } from './thunks';

class Index extends React.Component {
  static async getInitialProps({ query, req, asPath }) {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = context.renderPage;

    context.renderPage = () =>
      originalRenderPage({
        enhanceApp: App => props => sheets.collect(<App {...props} />)
      });

    const initialProps = await Document.getInitialProps(context);

    return {
      ...initialProps,

      styles: [
        <React.Fragment key='styles'>
          {initialProps.styles}
          {sheets.getStyleElement()}
        </React.Fragment>,
      ],
    };
    // 👆 document.js

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
      cookies: pageData.cookies,
      headers: req.headers,
      pageData: pageData.data
    };
  };

  componentDidMount() {
    // Delete the preload CSS code.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }

    const { cookies, headers, renderPage, pageParams, pageData } = this.props;
    Object.keys(cookies).forEach(key =>
      document.cookie = `${key}=${typeof cookies[key] === 'object' || Array.isArray(cookies[key]) ?
        escape(JSON.parse(cookies[key])) :
        escape(cookies[key])}`);
    this.props.dispatch({
      type: 'framework.updateState', payload: {
        data: {
          cookies, headers, pageParams
        },
        pages: {
          [renderPage]: typeof initState.pages[renderPage] === 'function' ? initState.pages[renderPage](pageData) : pageData
        },
        hasInitialized: true
      }
    });
  }

  render() {
    let modelsDealed = models();

    return (<>
      <Provider store={store}>
        {this.props.hasInitialized && [
          <head>
            <meta charSet='utf-8' />
            <meta
              name='viewport'
              content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no'
            />
            <style>{`
            body{
              margin: 0px;
              padding: 0px;
            }
            `}</style>
            <link
              rel='stylesheet'
              href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
            />
            <title>{
              typeof configs.title === 'string' ?
                configs.title :
                typeof configs.title[this.props.renderPage] === 'string' ?
                  configs.title[this.props.renderPage] :
                  configs.title[this.props.renderPage](this.props.pages[this.props.renderPage])
            }</title>
            <link rel='icon' href={configs.icon} />
          </head>,
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

let rendered = connect(state => state)(Index);