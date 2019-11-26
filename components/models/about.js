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
  return (
    <Dialog fullWidth open={true} onClose={props.$destory}>
      <DialogTitle>关于</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography variant="body1">这是一个示例项目，演示了一个简单的笔记存储服务，包含账户系统。</Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.$destory} color="primary">
          确认
        </Button>
      </DialogActions>
    </Dialog>
  );
}