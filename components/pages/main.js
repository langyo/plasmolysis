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
  mdiMagnify,
  mdiArrowRight
} from "@mdi/js";

export default props => {
  const classes = makeStyles(theme => ({
    centerRow: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row"
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
    }
  }))();

  return <div className={classes.centerRow}>
    {[
      <Paper
        className={classnames(
          classes.searchBar,
          classes.margin
        )}
      >
        <IconButton className={classes.iconButton} disabled>
          <Icon path={mdiArrowRight} size={1} />
        </IconButton>
        <InputBase
          className={classes.input}
          placeholder="搜索"
        />
        <IconButton className={classes.iconButton}>
          <Icon path={mdiMagnify} size={1} />
        </IconButton>
      </Paper>
    ]}
  </div>;
}