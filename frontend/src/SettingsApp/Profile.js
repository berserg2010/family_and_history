import React from 'react';

import withAuth from '../CoreApp/withAuth';
import UserInfo from "./UserInfo";


const Profile = ({ session }) => (
	<div>
		<UserInfo session={session}/>
	</div>
);

export default withAuth(session => session && session.currentUser)(Profile);
