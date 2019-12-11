import React from 'react';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

export default props => {
  return <ThemeProvider theme={createMuiTheme(props.data.theme)}>
    {props.children}
  </ThemeProvider>;
}