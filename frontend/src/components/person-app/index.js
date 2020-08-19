import React from 'react';
import { Redirect, Route, Switch, withRouter } from "react-router-dom";

import {
	PersonList,
	PersonItem,
} from "./person";


const Person = ({ match }) => {
	return (
		<Switch>
			<Route exact path={`${match.path}`} component={PersonList} />
			<Route path={`${match.path}/add`} render={() => <PersonItem />} />
			<Route path={`${match.path}/:id`} render={() => <PersonItem />} />
			<Redirect to="/" />
		</Switch>
	)
};

export default withRouter(Person);
