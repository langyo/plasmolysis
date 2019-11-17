import React from 'react';
import classnames from "classnames";
import { makeStyles } from "@material-ui/core/styles";

import IconButton from "@material-ui/core/IconButton";

import Icon from "@mdi/react";
import { mdiMenu } from "@mdi/js";

export default props => {
  const classes = makeStyles(theme => ({
    menu: {
      position: 'absolute',
      left: 30,
      top: 30,
      zIndex: 1000
    }
  }))();

  return [
    <IconButton className={classes.menu} onClick={() => props.openDrawer()}>
      <Icon path={mdiMenu} size={1} />
    </IconButton>
  ];
}