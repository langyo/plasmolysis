import React from 'react';
import classnames from 'classnames';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import {
  IconButton,
  Fab,
  Zoom
} from '@material-ui/core';

import {
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction
} from '@material-ui/lab';

import Icon from '@mdi/react';
import {
  mdiMenu,
  mdiPlus,
  mdiClose,
  mdiPencil,
  mdiContentSave
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
    },
    dashboard: {
      position: 'absolute',
      right: theme.spacing(6),
      bottom: theme.spacing(6),
      zIndex: 1000
    }
  }))();

  let [dialOpen, setDialOpen] = React.useState(false);

  return <div className={classes.rootOutside}>
    <div className={classes.rootInside}>
      <IconButton className={classes.menu} onClick={() => props.openDrawer()}>
        <Icon path={mdiMenu} size={1} />
      </IconButton>
      <SpeedDial
        className={classes.dashboard}
        ariaLabel='新建'
        hidden={props.showFab !== 'create'}
        icon={<SpeedDialIcon
          openIcon={<Icon path={mdiClose} size={1} color='#fff' />}
          icon={<Icon path={mdiPlus} size={1} color='#fff' />}
        />}
        onClose={() => setDialOpen(false)}
        onOpen={() => setDialOpen(true)}
        open={dialOpen}
        direction='up'
      >
        <SpeedDialAction
          icon={<Icon path={mdiPencil} size={1} />}
          tooltipTitle='随笔'
          onClick={props.createNewEditor}
        />
      </SpeedDial>
      <Zoom
        className={classes.dashboard}
        in={props.showFab === 'edit'}
      >
        <Fab color='primary'>
          <Icon path={mdiPencil} size={1} color='#fff' />
        </Fab>
      </Zoom>
      <Zoom
        className={classes.dashboard}
        in={props.showFab === 'save'}
      >
        <Fab color='primary' onClick={props.saveEditContent}>
          <Icon path={mdiContentSave} size={1} color='#fff' />
        </Fab>
      </Zoom>
    </div>
  </div>;
}