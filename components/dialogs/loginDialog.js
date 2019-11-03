import React from 'react';
import { makeStyles } from "@material-ui/core/styles";

import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

export default props => {
  const classes = makeStyles(theme => ({
    inputer: {
      width: 400
    }
  }))();

  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");

  return [
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>管理员登录</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs />
          <Grid item xs={12}>
            <TextField
              className={classes.inputer}
              autoFocus
              margin="dense"
              label="用户名"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs />
        </Grid>
        <Grid container>
          <Grid item xs />
          <Grid item xs={12}>
            <TextField
              className={classes.inputer}
              margin="dense"
              label="密码"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs />
        </Grid>
        <Divider />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={props.onClose}
          color="primary"
          disbaled={props.loginState === 'loading'}
        >
          取消
        </Button>
        <Button
          disabled={!(name && password)}
          onClick={() => props.onSubmit(name, password)}
          color="primary"
          disbaled={props.loginState === 'loading'}
        >
          登录
        </Button>
      </DialogActions>
    </Dialog>
  ];
}