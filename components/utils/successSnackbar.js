import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import { green } from '@material-ui/core/colors';

import Icon from "@mdi/react";
import { mdiCheckCircle, mdiClose } from "@mdi/js";

export default props => {
  const classes = makeStyles(theme => ({
    color: {
      backgroundColor: green[600],
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
      open={props.open}
      autoHideDuration={3000}
      onClose={props.onClose}
    >
      <SnackbarContent
        className={classes.color}
        message={
          <span className={classes.message}>
            <Icon className={classes.iconVariant} path={mdiCheckCircle} size={1} color='white' />
            {"登录成功！"}
          </span>
        }
        action={
          <IconButton color="inherit" onClick={props.onClose}>
            <Icon path={mdiClose} size={1} color='white' />
          </IconButton>
        }
      />
    </Snackbar>
  );
}