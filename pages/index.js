import React from 'react';
import Head from 'next/head';

import { connect } from 'react-redux';
import actions from '../src/actions';

import classnames from "classnames";
import { makeStyles } from "@material-ui/core/styles";

import {
  Typography,
  AppBar,
  Toolbar
} from "@material-ui/core";

import components from "../components";

export default connect(state => ({ state }), dispatch => ({
  dispatcher: {
    views: {

    },
    pages: {
      mainPage: {

      }
    }
  }
}))(props => {
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  const classes = makeStyles(theme => ({
    center: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column"
    },
    fillWidth: {
      width: "80%"
    }
  }))();

  return ([
    <Head>
      <title>TEMPLATE</title>
      <link rel='icon' href='/favicon.ico' />
    </Head>,
    <div className={classnames(classes.center)}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            模板页面
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classnames(classes.fillWidth, classes.center)}>
        {components.pages.mainPage}
      </div>
    </div>
  ]);
});
