import React from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

import {
  Paper,
  Typography,
  InputBase,
  IconButton
} from '@material-ui/core';

import Icon from '@mdi/react';

import {
  mdiGreasePencil,
  mdiMagnify,
  mdiChevronRight
} from '@mdi/js';

import redraft from 'redraft';
import ScrollArea from 'react-scrollbars-custom';

const renderers = {
  inline: {
    BOLD: (children, { key }) => <span key={key} style={{ fontWeight: '600' }}>{children}</span>,
    ITALIC: (children, { key }) => <span key={key} style={{ fontStyle: 'italic' }}>{children}</span>,
    UNDERLINE: (children, { key }) => <span key={key} style={{ textDecoration: 'underline' }}>{children}</span>
  },
  blocks: {
    unstyled: children => children.map(child => <p>{child}</p>),
  }
}

export default props => {
  const classes = makeStyles(theme => ({
    root: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      overflow: 'hidden'
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
    </div>,
    <div className={classnames(classes.maxWidth, classes.centerColumn, classes.cardListWidth, classes.marginTop)}>
      <ScrollArea mobileNative style={{ width: 400, height: 500 }}>
        {props.latestPush.length < 1 && <Paper className={classnames(classes.margin, classes.textAlignCenter)}>
          <Typography variant='body1' className={classes.margin}>{'空空如也'}</Typography>
          <Typography variant='body1' className={classes.margin}>{'点击右下角的按钮以添加笔记'}</Typography>
        </Paper>}
        {props.latestPush.length > 0 && props.latestPush.map((n, index) => <Paper key={index} className={classes.margin}>
          <Typography variant='h6' className={classes.margin}>{n.title}</Typography>
          <Typography variant='body1' className={classes.margin}>
            {redraft(JSON.parse(n.content), renderers)}
          </Typography>
        </Paper>)}
      </ScrollArea>
    </div>
    ]}
  </div>;
}