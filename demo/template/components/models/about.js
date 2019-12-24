import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Button
} from '@material-ui/core';

export default props => {
  const [isOpen, setOpen] = React.useState(true);
  const close = () => {
    setOpen(false);
    setTimeout(props.$destory, 500);
  }

  return (
    <Dialog fullWidth open={isOpen} onClose={close}>
      <DialogTitle>关于</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography component={'span'} variant='body1'>这是一个模板。</Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color='primary'>
          确认
        </Button>
      </DialogActions>
    </Dialog>
  );
}