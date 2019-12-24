import React from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/LIstItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import CardHeader from '@material-ui/core/CardHeader';

import Icon from '@mdi/react';
import {
  mdiInformation,
  mdiHome
} from '@mdi/js';

export default props => {
  const classes = makeStyles(theme => ({
    drawerList: {
      width: 240
    },
    divider: {
      marginTop: 10,
      marginBottom: 10
    },
    center: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    },
    centerRow: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row'
    },
    margin: {
      margin: 10
    }
  }))();

  return [<Drawer
    anchor='left'
    open={props.isOpen}
    onClose={props.close}
  >
    <List className={classes.drawerList}>
      <ListItem button onClick={() => props.openAboutDialog()}>
        <ListItemIcon>
          <Icon path={mdiInformation} size={1} />
        </ListItemIcon>
        <ListItemText primary={'关于'} />
      </ListItem>
      <Divider className={classes.divider} />
    </List>
  </Drawer>];
}