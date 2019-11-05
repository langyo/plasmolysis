import React from 'react';

import { connect } from 'react-redux';
import actions from '../src/actions';

import classnames from "classnames";
import { makeStyles } from "@material-ui/core/styles";

import {
  Typography,
  AppBar,
  Toolbar
} from "@material-ui/core";

import components from "../index";

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
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">
          I 笔记
          </Typography>
      </Toolbar>
    </AppBar>
  );
});
