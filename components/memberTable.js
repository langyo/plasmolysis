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

export default props => {
  const classes = makeStyles(theme => ({
    margin: {
      margin: 10
    },
    tableItem: {
      minWidth: 200
    },
    tableIcon: {
      width: 24
    }
  }))();

  return <Paper>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell className={classes.tableIcon}>
            <IconButton
              onClick={() => props.setDialogOpen(true)}
            >
              <Icon path={mdiPlus} size={1} />
            </IconButton>
          </TableCell>
          <TableCell className={classes.tableItem}>
            <Typography variant="body1">姓名</Typography>
          </TableCell>
          <TableCell className={classes.tableItem} align="right">
            <Typography variant="body1">性别</Typography>
          </TableCell>
          <TableCell className={classes.tableItem} align="right">
            <Typography variant="body1">请假理由</Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.studentList.map((n, index) =>
          <TableRow key={index}>
            <TableCell className={classes.tableIcon}>
              <IconButton
                onClick={() => props.removeMember(index)}
              >
                <Icon path={mdiClose} size={1} />
              </IconButton>
            </TableCell>
            <TableCell className={classes.tableItem} component="th" scope="row">
              <Typography variant="body1">{n.name}</Typography>
            </TableCell>
            <TableCell className={classes.tableItem} align="right">
              <Typography variant="body1">{n.sex === "boy" ? "男" : "女"}</Typography>
            </TableCell>
            <TableCell className={classes.tableItem} align="right">
              <Typography variant="body1">{n.reason}</Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
    {props.studentList.length === 0 && [<Typography variant="body1" className={classes.margin}>
      上报列表是空的，点击表格左上角的加号可以添加未到的同学
    </Typography>,
    <Typography variant="body1" className={classes.margin}>
      如果没有需要上报的同学，直接点击下一步提交即可
    </Typography>]}
    <FormDialog
      open={props.dialogOpen}
      onClose={props.setDialogClose}
      onSubmit={props.addMember}
    />
  </Paper>;
}