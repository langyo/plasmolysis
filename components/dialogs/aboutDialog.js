import React from 'react';
import { makeStyles } from "@material-ui/core/styles";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Button
} from "@material-ui/core";

export default props => {
  const classes = makeStyles(theme => ({
  }))();

  return (
    <Dialog fullWidth open={props.open} onClose={props.onClose}>
      <DialogTitle>关于</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography variant="body1">模板</Typography>
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