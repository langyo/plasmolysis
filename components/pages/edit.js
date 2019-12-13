import React from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

import {
  Paper,
  Typography
} from '@material-ui/core';

export default props => {
  const classes = makeStyles(theme => ({
    centerRow: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row'
    },
    fillWidth: {
      width: '80%'
    },
    margin: {
      margin: 10
    }
  }))();

  return <div className={classes.centerRow}>
    <Paper
      className={classnames(
        classes.centerRow,
        classes.fillWidth,
        classes.margin
      )}
    >
      <Typography className={classes.margin} variant='body1'>编辑页，正在施工……</Typography>
    </Paper>
  </div>;
}