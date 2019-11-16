import React from "react";
import classnames from "classnames";
import { makeStyles } from "@material-ui/core/styles";

import {
  Paper,
  Typography
} from "@material-ui/core";

export default props => {
  const classes = makeStyles(theme => ({
    centerRow: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row"
    },
    fillWidth: {
      width: "80%"
    },
    margin: {
      margin: 10
    }
  }))();

  return [
    <Paper
      className={classnames(
        classes.centerRow,
        classes.fillWidth
      )}
    >
      <Typography className={classes.margin} variant='body1'>展示页</Typography>
    </Paper>
  ]
}