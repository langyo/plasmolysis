import React from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

import {
  Paper,
  Typography,
  InputBase,
  IconButton,
  ButtonBase
} from '@material-ui/core';

import Icon from '@mdi/react';
import {
  mdiGreasePencil,
  mdiMagnify,
  mdiChevronRight
} from '@mdi/js';

import ScrollArea from 'react-scrollbars-custom';

export default props => {
  const classes = makeStyles(theme => ({
    root: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      overflow: 'hidden'
    },
    rootScroll: {
      width: '100%',
      height: '100%',
      overflow: 'auto'
    },
    centerRow: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row'
    },
    centerColumn: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    },
    maxWidth: {
      width: '100%'
    },
    cardListWidth: {
      width: '60%',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    previewCardOutside: {
      width: '60%',
      minWidth: 400
    },
    previewCardInside: {
      width: '100%',
      textAlign: 'left'
    },
    margin: {
      margin: 10
    },
    marginTop: {
      marginTop: 10
    },
    searchBar: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: '30%',
      minWidth: 300
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1
    },
    iconButton: {
      padding: 10
    },
    textAlignCenter: {
      textAlign: 'center'
    }
  }))();

  return <div className={classes.root}>
    <ScrollArea mobileNative className={classes.rootScroll}>
      {[
        <div className={classnames(classes.maxWidth, classes.centerRow)}>
          <Icon path={mdiGreasePencil} size={3} className={classes.margin} color='#3399cc' />
        </div>,
        <div className={classnames(classes.maxWidth, classes.centerRow)}>
          <Typography component={'span'} variant='h5' className={classes.margin}>I 笔记</Typography>
        </div>,
        <div className={classnames(classes.maxWidth, classes.centerRow)}>
          <Paper className={classes.searchBar}>
            <IconButton className={classes.iconButton} disabled>
              <Icon path={mdiChevronRight} size={1} />
            </IconButton>
            <InputBase
              className={classes.input}
              placeholder='搜索'
            />
            <IconButton className={classes.iconButton}>
              <Icon path={mdiMagnify} size={1} />
            </IconButton>
          </Paper>
        </div>
      ]}
    </ScrollArea>
  </div>;
}