import React, {Component} from 'react';
import { NavLink } from "react-router-dom";

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {Divider, List} from "@material-ui/core";
// import Collapse from '@material-ui/core/Collapse';
// import InboxIcon from '@material-ui/icons/MoveToInbox';
// import ExpandLess from '@material-ui/icons/ExpandLess';
// import ExpandMore from '@material-ui/icons/ExpandMore';
// import StarBorder from '@material-ui/icons/StarBorder';


const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
});

class NavItem extends Component {
  state = {
    open: true,
  };

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };

render() {

  // const { classes } = this.props;

  return (
    <List>
      <ListItem button component={NavLink} to="/">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>

      <Divider />

      <ListItem button component={NavLink} to="/tree">
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Tree"/>
      </ListItem>

      <Divider />

      {/*<ListSubheader>Objects</ListSubheader>*/}
      <ListItem button component={NavLink} to="/person">
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Persons"/>
      </ListItem>

      {/*<ListSubheader>Events</ListSubheader>*/}
      <ListItem button component={NavLink} to="/family">
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Family"/>
      </ListItem>

      <Divider />

      {/*<ListItem button onClick={this.handleClick}>*/}
      {/*  <ListItemIcon>*/}
      {/*    <InboxIcon />*/}
      {/*  </ListItemIcon>*/}
      {/*  <ListItemText inset primary="Inbox" />*/}
      {/*  {this.state.open ? <ExpandLess /> : <ExpandMore />}*/}
      {/*</ListItem>*/}

      {/*<Collapse in={this.state.open} timeout="auto" unmountOnExit>*/}
      {/*  <List component="div" disablePadding>*/}
      {/*    <ListItem button className={classes.nested}>*/}
      {/*      <ListItemIcon>*/}
      {/*        <StarBorder />*/}
      {/*      </ListItemIcon>*/}
      {/*      <ListItemText inset primary="Starred" />*/}
      {/*    </ListItem>*/}
      {/*  </List>*/}
      {/*</Collapse>*/}

      {/*<ListItem button component={NavLink} to="/search">*/}
      {/*  <ListItemIcon>*/}
      {/*    <PeopleIcon />*/}
      {/*  </ListItemIcon>*/}
      {/*  <ListItemText primary="Search"/>*/}
      {/*</ListItem>*/}

      {/*<ListItem button component={NavLink} to="/profile">*/}
      {/*  <ListItemIcon>*/}
      {/*    <PeopleIcon />*/}
      {/*  </ListItemIcon>*/}
      {/*  <ListItemText primary="Profile"/>*/}
      {/*</ListItem>*/}
    </List>
  )}
}

NavItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavItem);
