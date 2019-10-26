import React from 'react';
import classnames from "classnames";
import { makeStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";

import Icon from "@mdi/react";
import { mdiPlus, mdiClose } from "@mdi/js";

import FormDialog from "./addMemberDialog";

export default function (props) {
  const classes = makeStyles(theme => ({
    body: {
      width: '90%',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginBottom: 30
    },
    margin: {
      margin: 20
    },
    tableItem: {
      minWidth: 120
    }
  }))();

  return <Paper className={classes.body}>
    <Typography className={classes.margin} variant="h5">最近 10 次晨检上报记录的学生列表</Typography>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell className={classes.tableItem}>
            <Typography variant="body1">姓名</Typography>
          </TableCell>
          <TableCell className={classes.tableItem} align="right">
            <Typography variant="body1">性别</Typography>
          </TableCell>
          <TableCell className={classes.tableItem} align="right">
            <Typography variant="body1">班级</Typography>
          </TableCell>
          <TableCell className={classes.tableItem} align="right">
            <Typography variant="body1">请假理由</Typography>
          </TableCell>
          <TableCell className={classes.tableItem} align="right">
            <Typography variant="body1">时间</Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.list.map((n, index) =>
          <TableRow key={index}>
            <TableCell className={classes.tableItem} component="th" scope="row">
              <Typography variant="body1">{n.name}</Typography>
            </TableCell>
            <TableCell className={classes.tableItem} align="right">
              <Typography variant="body1">{n.sex === "boy" ? "男" : "女"}</Typography>
            </TableCell>
            <TableCell className={classes.tableItem} align="right">
              <Typography variant="body1">{['高一', '高二', '高三'][n.grade - 1] + '(' + n.classId + ')班'}</Typography>
            </TableCell>
            <TableCell className={classes.tableItem} align="right">
              <Typography variant="body1">{n.reason}</Typography>
            </TableCell>
            <TableCell className={classes.tableItem} align="right">
              <Typography variant="body1">{/^[0-9]+\-([0-9]+\-[0-9]+)/.exec(n.date)[1]}</Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </Paper>;
}