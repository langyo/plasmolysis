import React from 'react';
import classnames from "classnames";
import { makeStyles } from "@material-ui/core/styles";

import {
  IconButton
} from "@material-ui/core";
import {
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction
} from "@material-ui/lab";

import Icon from "@mdi/react";
import {
  mdiMenu,
  mdiPlus,
  mdiClose,
  mdiPencil,
  mdiFileOutline
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

  let [dialOpen, setDialOpen] = React.useState(false);

  return [
    <IconButton className={classes.menu} onClick={() => props.openDrawer()}>
      <Icon path={mdiMenu} size={1} />
    </IconButton>,
    <SpeedDial
      ariaLabel="新建"
      className={classes.dashboard}
      hidden={false}
      icon={<SpeedDialIcon openIcon={<Icon path={mdiClose} size={1} color='#fff' />} icon={<Icon path={mdiPlus} size={1} color='#fff' />} />}
      onClose={() => setDialOpen(false)}
      onOpen={() => setDialOpen(true)}
      open={dialOpen}
      direction='up'
    >
      <SpeedDialAction
        icon={<Icon path={mdiPencil} size={1} />}
        tooltipTitle='随笔'
        onClick={() => setDialOpen(false)}
      />
      <SpeedDialAction
        icon={<Icon path={mdiFileOutline} size={1} />}
        tooltipTitle='文档'
        onClick={() => setDialOpen(false)}
      />
    </SpeedDial>
  ];
}