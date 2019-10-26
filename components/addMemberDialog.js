import React from 'react';
import { makeStyles } from "@material-ui/core/styles";

import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Switch from "@material-ui/core/Switch";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";

export default props => {
  const classes = makeStyles(theme => ({
    inputer: {
      width: 200
    },
    selector: {
      width: 200,
      margin: 10
    }
  }))();

  const [name, setName] = React.useState("");
  const [sex, setSex] = React.useState("boy");
  const [reasonMode, setReasonMode] = React.useState(false);
  const [reason, setReason] = React.useState("");

  return (
    <Dialog fullWidth open={props.open} onClose={props.onClose}>
      <DialogTitle>添加学生</DialogTitle>
      <DialogContent>
        <DialogContentText>
          请填写当天未到校学生的基本信息与请假理由，一次填写一个。
          </DialogContentText>
        <TextField
          className={classes.inputer}
          autoFocus
          margin="dense"
          label="姓名"
          valuie={name}
          onChange={e => setName(e.target.value)}
        />
        <Divider />
        <FormLabel>性别</FormLabel>
        <FormGroup>
          <RadioGroup
            name="sex"
            value={sex}
            onChange={e => setSex(e.target.value)}
            row
          >
            <FormControlLabel value="boy" control={<Radio />} label="男" />
            <FormControlLabel value="girl" control={<Radio />} label="女" />
          </RadioGroup>
        </FormGroup>
        <Divider />
        <Grid container>
          <Grid item xs={12}>
            <FormLabel>请假理由</FormLabel>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={reasonMode}
                  onChange={() => setReasonMode(!reasonMode)}
                />
              }
              label="自行填写"
            />
          </Grid>
          <Grid item xs={12}>
            {reasonMode === false && (
              <Select className={classes.selector} value={reason} onChange={e => setReason(e.target.value)}>
                <MenuItem value={"感冒/发烧"}>感冒/发烧</MenuItem>
                <MenuItem value={"腹泻/呕吐"}>腹泻/呕吐</MenuItem>
                <MenuItem value={"皮疹"}>皮疹</MenuItem>
                <MenuItem value={"红眼病"}>红眼病</MenuItem>
                <MenuItem value={"受伤"}>受伤</MenuItem>
              </Select>
            )}
            {reasonMode === true && (<TextField
              className={classes.inputer}
              autoFocus
              margin="dense"
              label="理由"
              valuie={reason}
              onChange={e => setReason(e.target.value)}
            />)}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          取消
        </Button>
        <Button onClick={() => props.onSubmit(name, sex, reason)} color="primary">
          添加
        </Button>
      </DialogActions>
    </Dialog>
  );
}