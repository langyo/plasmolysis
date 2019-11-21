import React from 'react';
import classnames from "classnames";
import { makeStyles } from "@material-ui/core/styles";

import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/LIstItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import CardHeader from "@material-ui/core/CardHeader";

import Icon from "@mdi/react";
import {
  mdiAccount,
  mdiInformation,
  mdiLogin,
  mdiAccountMultiplePlusOutline,
  mdiAccountArrowRightOutline,
  mdiBookOpenVariant,
  mdiFileEditOutline,
  mdiHome
} from "@mdi/js";

export default props => {
  const classes = makeStyles(theme => ({
    drawerList: {
      width: 240
    },
    divider: {
      marginTop: 10,
      marginBottom: 10
    },
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
    margin: {
      margin: 10
    }
  }))();

  return [<Drawer
    anchor="left"
    open={props.isOpen}
    onClose={() => props.close()}
  >
    <List className={classes.drawerList}>
      {props.data.account.hasLogin === false && <CardHeader
        avatar={
          <Icon path={mdiAccount} size={1} />
        }
        title="尚未登录"
        subheader="登录以获取更多权限"
      />}
      {props.data.account.hasLogin === true && <CardHeader
        avatar={
          <Icon path={mdiAccount} size={1} />
        }
        title={props.data.account.userName}
      />}
      <Divider className={classes.divider} />
      {props.data.account.hasLogin === false && [<ListItem button onClick={() => props.openLoginDialog()}>
        <ListItemIcon>
          <Icon path={mdiAccountArrowRightOutline} size={1} />
        </ListItemIcon>
        <ListItemText primary={"登录"} />
      </ListItem>,
      <ListItem button onClick={() => props.openRegisterDialog()}>
        <ListItemIcon>
          <Icon path={mdiAccountMultiplePlusOutline} size={1} />
        </ListItemIcon>
        <ListItemText primary={"注册"} />
      </ListItem>]}
      {props.data.account.hasLogin === true && <ListItem button onClick={() => props.logoutUpdate()}>
        <ListItemIcon>
          <Icon path={mdiLogin} size={1} />
        </ListItemIcon>
        <ListItemText primary={"登出"} />
      </ListItem>}
      <ListItem button onClick={() => props.openAboutDialog()}>
        <ListItemIcon>
          <Icon path={mdiInformation} size={1} />
        </ListItemIcon>
        <ListItemText primary={"关于"} />
      </ListItem>
      <Divider className={classes.divider} />
      <ListItem button onClick={() => props.openMainPage()}>
        <ListItemIcon>
          <Icon path={mdiHome} size={1} />
        </ListItemIcon>
        <ListItemText primary={"主页"} />
      </ListItem>
      <ListItem button onClick={() => props.openEditPage()}>
        <ListItemIcon>
          <Icon path={mdiFileEditOutline} size={1} />
        </ListItemIcon>
        <ListItemText primary={"编辑"} />
      </ListItem>
      <ListItem button onClick={() => props.openShowPage()}>
        <ListItemIcon>
          <Icon path={mdiBookOpenVariant} size={1} />
        </ListItemIcon>
        <ListItemText primary={"展示"} />
      </ListItem>
    </List>
  </Drawer>];
}