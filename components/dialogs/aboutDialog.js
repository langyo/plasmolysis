import React from 'react';
import { makeStyles } from "@material-ui/core/styles";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

export default props => {
  const classes = makeStyles(theme => ({
    right: {
      textAlign: 'right'
    }
  }))();

  return (
    <Dialog fullWidth open={props.open} onClose={props.onClose}>
      <DialogTitle>关于</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography variant="body1">
            这是为我自己的学校定制的晨检上报系统，使用 Material-UI + Redux + React + Next.js + Express + Mongodb。
          </Typography>
          <Typography variant="body1" className={classes.right}>
            开发者 <a href="https://github.com/langyo">langyo</a>
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          确认
        </Button>
      </DialogActions>
    </Dialog>
  );
}