import React from 'react';
import { Redirect, Route, Switch, withRouter } from "react-router-dom";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";

import Tree from '../../tree-app';
import Person from "../../person-app";
import Family from '../../family-app'
import { Search } from "../../../CoreApp";


const styles = (theme) => ({
	appBarSpacer: theme.mixins.toolbar,

	content: {
		flexGrow: 1,
		padding: theme.spacing.unit * 3,
		height: '100vh',
		overflow: 'auto',
	},

	toolbar: {
		paddingRight: 24, // keep right padding when drawer closed
	},
});

const Main = (props) => {
	const {
		classes,
	} = props;

	return (
		<main className={classes.content}>
			<div className={classes.appBarSpacer} />
			<Switch>
				<Route exact path="/"><p>Home</p></Route>
				<Route path={`/tree`} render={({ match }) => <Tree />} />
				<Route path={`/person`} render={({ match }) => <Person />} />
				<Route path={`/family`} render={({ match }) => <Family />} />
				<Route exact path="/search" component={Search} />
				<Redirect to="/" />
			</Switch>
		</main>
	)
};

Main.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(
	withStyles(styles)(Main)
);
