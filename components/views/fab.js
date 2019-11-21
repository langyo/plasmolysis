import React from 'react';
import classnames from "classnames";
import { makeStyles } from "@material-ui/core/styles";

import {
  IconButton,
  Fab
} from "@material-ui/core";

import Icon from "@mdi/react";
import {
  mdiMenu,
  mdiPlus
} from "@mdi/js";

export default props => {
  const classes = makeStyles(theme => ({
    menu: {
      position: 'absolute',
      left: 30,
      top: 30,
      zIndex: 1000
    },
    dashboard: {
      position: 'absolute',
      right: 30,
      bottom: 30,
      zIndex: 1000
    }
  }))();

  return [
    <IconButton className={classes.menu} onClick={() => props.openDrawer()}>
      <Icon path={mdiMenu} size={1} />
    </IconButton>,
    <Fab className={classes.dashboard} color='primary'>
      <Icon path={mdiPlus} size={1} color='#fff' />
    </Fab>
  ];
}