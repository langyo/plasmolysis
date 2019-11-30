import React from "react";
import classnames from "classnames";
import { makeStyles } from "@material-ui/core/styles";

import {
  Paper,
  Typography,
  InputBase,
  Grid,
  IconButton
} from "@material-ui/core";

import Icon from "@mdi/react";

import {
  mdiGreasePencil,
  mdiMagnify,
  mdiChevronRight
} from "@mdi/js";

export default props => {
  const classes = makeStyles(theme => ({
    centerRow: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row"
    },
    maxWidth: {
      width: '100%'
    },
    margin: {
      margin: 10
    },
    searchBar: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: "30%",
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

  return [
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
          placeholder="搜索"
        />
        <IconButton className={classes.iconButton}>
          <Icon path={mdiMagnify} size={1} />
        </IconButton>
      </Paper>
    </div>,
    <div className={classnames(classes.maxWidth, classes.centerRow)}>
      {props.data.notes.latestPush.length < 1 && <Paper className={classnames(classes.margin, classes.textAlignCenter)}>
        <Typography variant='body1' className={classes.margin}>{'空空如也'}</Typography>
        <Typography variant='body1' className={classes.margin}>{'点击右下角的按钮以添加笔记' + props.text}</Typography>
      </Paper>}
    </div>
  ];
}