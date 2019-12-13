import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

export default props => {
  const classes = makeStyles(theme => ({
    root: {
      width: '100%',
      height: '100%'
    }
  }))();

  return <ThemeProvider theme={createMuiTheme(props.data.theme)}>
    <div className={classes.root}>
      {props.children}
    </div>
  </ThemeProvider>;
}