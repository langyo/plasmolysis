import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
  IconButton,
  Snackbar,
  SnackbarContent
} from '@material-ui/core';

import { red } from '@material-ui/core/colors';

import Icon from '@mdi/react';
import { mdiCloseCircle, mdiClose } from '@mdi/js';

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

  const [isOpen, setOpen] = React.useState(true);
  const close = () => {
    setOpen(false);
    setTimeout(props.$destory, 500);
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={isOpen}
      autoHideDuration={3000}
      onClose={close}
    >
      <SnackbarContent
        className={classes.color}
        message={
          <span className={classes.message}>
            <Icon className={classes.iconVariant} path={mdiCloseCircle} size={1} color='white' />
            {props.content}
          </span>
        }
        action={
          <IconButton color='inherit' onClick={close}>
            <Icon path={mdiClose} size={1} color='white' />
          </IconButton>
        }
      />
    </Snackbar>
  );
}