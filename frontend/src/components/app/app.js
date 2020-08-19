import React from 'react';
import {
	Route,
	Switch,
} from "react-router-dom";

import Dashboard from '../dashboard';
import Signup from "../auth/signup"
import Signin from "../auth/signin"
import withSession from "../../CoreApp/withSession";


const App = () => (
	<Switch>
		<Route exact path="/signin" render={() => <Signin />} />
		<Route exact path="/signup" render={() => <Signup />} />
		<Route render={() => <Dashboard />} />
	</Switch>
);

export default withSession(App);
