import React from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

import {
  IconButton
} from '@material-ui/core';

import Icon from '@mdi/react';
import {
  mdiMenu,
} from '@mdi/js';

export default props => {
  const classes = makeStyles(theme => ({
    rootOutside: {
      width: '100%',
      height: '100%',
      position: 'absolute'
    },
    rootInside: {
      width: '100%',
      height: '100%'
    },
    menu: {
      position: 'absolute',
      left: theme.spacing(4),
      top: theme.spacing(4),
      zIndex: 1000

    }
  }))();

  return <div className={classes.rootOutside}>
    <div className={classes.rootInside}>
      <IconButton className={classes.menu} onClick={() => props.openDrawer()}>
        <Icon path={mdiMenu} size={1} />
      </IconButton>
    </div>
  </div>;
}