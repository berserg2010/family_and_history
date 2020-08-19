import React, { Component, Fragment } from 'react';

import PropTypes from "prop-types";
import classNames from "classnames";
import { AppBar, CssBaseline, IconButton, Toolbar, Typography, withStyles } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from "@material-ui/core/Popover";
import deepOrange from '@material-ui/core/colors/deepOrange';

import Signout from "../../auth/signout";
import { withSession } from "../../../CoreApp";


const drawerWidth = 240;

const styles = (theme) => ({
	toolbar: {
		paddingRight: 24, // keep right padding when drawer closed
	},

	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},

	menuButton: {
		marginLeft: 12,
		marginRight: 36,
	},
	menuButtonHidden: {
		display: 'none',
	},

	title: {
		flexGrow: 1,
	},

	orangeAvatar: {
		// margin: `.2em`,
		color: '#fff',
		backgroundColor: deepOrange[500],
	},
});

class Header extends Component {

	state = {
		anchorEl: null,
	};

	handleClick = event => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleClose = () => {
		this.setState({ anchorEl: null });
	};

	render() {

		const {
			classes,
			open,
			session: { currentUser: { firstName, lastName }},
			handleDrawerOpen
		} = this.props;

		const { anchorEl } = this.state;

		return(
			<Fragment>
				<CssBaseline />

				<AppBar
						position="absolute"
						className={classNames(
							classes.appBar, open && classes.appBarShift)}
				>
					<Toolbar disableGutters={!open} className={classes.toolbar}>
						<IconButton
							color="inherit"
							aria-label="Open drawer"
							onClick={handleDrawerOpen}
							className={classNames(
								classes.menuButton, open && classes.menuButtonHidden)}>
							<MenuIcon />
						</IconButton>

						<Typography
							component="h1"
							variant="h6"
							color="inherit"
							noWrap
							className={classes.title}>
							Welcome, <strong>{this.props.session.currentUser.email}</strong>
						</Typography>

						<IconButton
							aria-owns={anchorEl ? 'menu-appbar' : undefined}
							aria-haspopup="true"
							onClick={this.handleClick}
							color="inherit"
						>
							<Avatar className={classes.orangeAvatar}>
								{ firstName[0] }{ lastName[0] }
							</Avatar>
						</IconButton>

						<Popover
							id="menu-appbar"
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'right',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}

							open={Boolean(anchorEl)}
							onClose={this.handleClose}
						>
							<MenuItem onClick={this.handleClose}>Profile</MenuItem>
							<MenuItem onClick={this.handleClose}>My account</MenuItem>

							<Signout />
						</Popover>

					</Toolbar>
				</AppBar>
			</Fragment>
		)
	}
}

Header.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withSession(
	withStyles(styles)(Header));
