import React from 'react';
import { Redirect } from "react-router-dom";
import { Query } from "react-apollo";

import { CURRENT_USER } from '../queries';


const conditionFunc = (data) => {
	return data && data.currentUser
};

const withAuth = (Component) => (props) => (
	<Query query={CURRENT_USER}>
		{({ data, loading }) => {
			if (loading) return null;

			return conditionFunc(data)
				? <Component { ...props } />
				: <Redirect to='/signin' />
		}}
	</Query>
);

export default withAuth;
