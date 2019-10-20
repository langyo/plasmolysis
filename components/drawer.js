import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider'
import Badge from '@material-ui/core/Badge';

const styles = theme => ({
  list: {
    width: 240,
    opacity: 0.9,
  },
  line: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5)
  }
});

class MainDrawer extends React.Component {
  static propTypes = {
    // State
    show: PropTypes.string,
    open: PropTypes.bool,
    items: PropTypes.array,
    // Dispatcher
    onTogglePage: PropTypes.func,
    onToggleDialog: PropTypes.func,
    onToggleDrawer: PropTypes.func
  };

  render() {
    const { classes } = this.props;

    return (
      <Drawer
        open={this.props.open}
        onClose={this.props.onToggleDrawer}
        className={classes.list}
        variant={'temporary'}
      >
        <List className={classes.list}>
          {this.props.items.map((n, index) => {
            // Divider
            if (typeof n === 'string' && /^\-{2,}$/.test(n)) return <Divider className={classes.line} key={index} />;

            // The other
            return (<ListItem button key={index}
              onClick={
                n.page ? () => this.props.onTogglePage(n.page) :
                n.dialog ? () => this.props.onToggleDialog(n.dialog) :
                () => (null)
              }
              selected={
                n.selected && (n.selected.indexOf(this.props.show) >= 0)
              }
            >
              <ListItemIcon>
                {n.badge ? <Badge
                  color={
                    n.badge.color ? n.badge.color : 'primary'
                  }
                  variant={
                    (n.badge === 'dot' || n.badge.type === 'dot') ? 'dot' : null
                  }
                >
                  {n.icon}
                </Badge> : n.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  (typeof n.text === 'string') ? n.text : n.text.primary
                }
                secondary={
                  n.text.secondary
                } />
            </ListItem>)
          })}
        </List>
      </Drawer>
    );
  }
}

export default withStyles(styles)(MainDrawer);
