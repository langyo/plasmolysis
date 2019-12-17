import React from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

import {
  Paper,
  Typography,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Chip
} from '@material-ui/core';

import redraft from 'redraft';
import ScrollArea from 'react-scrollbars-custom';

import Icon from '@mdi/react';
import {
  mdiDotsVertical
} from '@mdi/js';

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
    rootScroll: {
      width: '100%',
      height: '100%',
      overflow: 'auto'
    },
    margin: {
      margin: theme.spacing(2)
    },
    padding: {
      padding: theme.spacing(2)
    },
    chip: {
      margin: theme.spacing(1),
      marginRight: 0
    },
    menu: {
      width: 100
    }
  }))();

  const [anchorEl, setAnchorEl] = React.useState(null);

  return <div className={classnames(classes.centerColumn, classes.root)}>
    <ScrollArea mobileNative className={classes.rootScroll}>
      <Grid container>
        <Grid item xs />
        <Grid item xs={8}>
          <Paper
            className={classnames(
              classes.margin,
              classes.padding
            )}
          >
            {props.content && <>
              <Grid container>
                <Grid item xs={10}>
                  <Typography className={classes.margin} variant='h6'>
                    {props.title}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
                    <Icon path={mdiDotsVertical} size={1} />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}>
                    <MenuItem
                      className={classes.menu}
                      onClick={() => setAnchorEl(null)}
                    >
                      {"删除"}
                    </MenuItem>
                  </Menu>
                </Grid>
              </Grid>
              <Divider className={classes.margin} />
              {props.tags.map((n, index) => <Chip
                key={index}
                className={classes.chip}
                label={n}
              />)}
              <Divider className={classes.margin} />
              <Typography className={classes.margin} variant='body1'>
                {redraft(JSON.parse(props.content), renderers)}
              </Typography>
            </>}
            {!props.content && <Typography variant="body1" className={classes.margin}>
              {'该笔记是空的'}
            </Typography>}
          </Paper>
        </Grid>
        <Grid item xs />
      </Grid>
    </ScrollArea>
  </div>;
}