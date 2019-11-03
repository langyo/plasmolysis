import React from 'react';
import classnames from "classnames";
import { makeStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";

import Icon from "@mdi/react";
import { mdiCheck, mdiClose } from "@mdi/js";

export default props => {
  const classes = makeStyles(theme => ({
    center: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column"
    },
    centerRow: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row"
    },
    fillWidth: {
      width: "80%"
    },
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

  return [<Paper
    className={classnames(
      classes.center,
      classes.fillWidth
    )}
  >
    {props.submitState === 'loading' && [
      <Typography className={classes.margin} variant="body1">
        正在提交
      </Typography>,
      <CircularProgress className={classes.margin} />
    ]}
    {props.submitState === 'success' && [
      <Typography className={classes.margin} variant="body1">
        提交成功
      </Typography>,
      <Icon className={classes.margin} path={mdiCheck} size={2} />
    ]}
    {props.submitState === 'fail' && [
      <Typography className={classes.margin} variant="body1">
        提交失败
      </Typography>,
      <Icon className={classes.margin} path={mdiClose} size={2} />
    ]}

    {props.fetchLatestState === 'loading' && [
      <Typography className={classes.margin} variant="body1">
        正在获取最近上报的记录列表
      </Typography>,
      <CircularProgress className={classes.margin} />
    ]}
    {props.fetchLatestState === 'success' && <Paper className={classes.body}>
      <Typography className={classes.margin} variant="h6">最近 10 次晨检上报记录的学生列表</Typography>
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
          {props.fetchLatestList.map((n, index) =>
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
    </Paper>}
    {props.fetchLatestState === 'fail' && [
      <Typography className={classes.margin} variant="body1">
        获取上报列表失败
      </Typography>,
      <Icon className={classes.margin} path={mdiClose} size={2} />
    ]}
  </Paper>,
  <Button className={classes.margin} onClick={props.backToHeadStep}>
    返回至开始位置
  </Button>];
}