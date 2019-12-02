import React from 'react';
import { makeStyles } from "@material-ui/core/styles";

import {
  Dialog,
  Paper,
  Typography,
  Slide,
  AppBar,
  Toolbar,
  IconButton
} from "@material-ui/core";

import Icon from "@mdi/react";
import {
  mdiContentSave,
  mdiClose
} from "@mdi/js";

import { Editor, EditorState } from 'draft-js';

export default props => {
  const classes = makeStyles(theme => ({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    content: {
      margin: 10,
      padding: 10
    }
  }))();

  const [content, setContent] = React.useState(EditorState.createEmpty());

  const [isOpen, setOpen] = React.useState(true);
  const close = () => {
    setOpen(false);
    setTimeout(props.$destory, 500);
  }

  return [
    <Dialog
      fullScreen
      open={isOpen}
      onClose={close}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton color="inherit" onClick={close}>
            <Icon path={mdiClose} size={1} color="#fff" />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            编辑笔记
          </Typography>
          <IconButton color="inherit" onClick={close}>
            <Icon path={mdiContentSave} size={1} color="#fff" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Paper className={classes.content}>
        <Editor editorState={content} onChange={setContent} />
      </Paper>
    </Dialog>
  ];
}