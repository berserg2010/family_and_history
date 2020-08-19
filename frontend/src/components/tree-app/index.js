import React from 'react';
import { Redirect, Route, Switch, withRouter } from "react-router-dom";

import Canvas from './canvas';


const Tree = ({ match }) => {
	return (
		<Switch>
			<Route exact path={`${match.path}`} component={Canvas} />
			<Redirect to="/" />
		</Switch>
	)
};

export default withRouter(Tree);
