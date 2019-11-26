import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
  IconButton,
  Snackbar,
  SnackbarContent
} from '@material-ui/core';

import { red } from '@material-ui/core/colors';

import Icon from "@mdi/react";
import { mdiCheckCircle, mdiClose } from "@mdi/js";

export default props => {
  const classes = makeStyles(theme => ({
    color: {
      backgroundColor: red[600],
    },
    message: {
      display: 'flex',
      alignItems: 'center'
    },
    iconVariant: {
      marginRight: theme.spacing(1),
    }
  }))();

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={true}
      autoHideDuration={3000}
      onClose={props.$destory}
    >
      <SnackbarContent
        className={classes.color}
        message={
          <span className={classes.message}>
            <Icon className={classes.iconVariant} path={mdiCheckCircle} size={1} color='white' />
            {"登录失败，请检查用户名与密码！"}
          </span>
        }
        action={
          <IconButton color="inherit" onClick={props.close}>
            <Icon path={mdiClose} size={1} color='white' />
          </IconButton>
        }
      />
    </Snackbar>
  );
}