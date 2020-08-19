import React from 'react';
import { Redirect, Route, Switch, withRouter } from "react-router-dom";

import {
	FamilyList,
	FamilyItem,
} from "./family";


const Family = ({ match }) => {
	return (
		<Switch>
			<Route exact path={`${match.path}`} component={FamilyList} />
			<Route path={`${match.path}/add`} render={() => <FamilyItem />} />
			<Route path={`${match.path}/:id`} render={() => <FamilyItem />} />
			<Redirect to="/" />
		</Switch>
	)
};

export default withRouter(Family);
