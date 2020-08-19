import React from 'react';


const formatDate = date => {
	const newDate = new Date(date).toLocaleDateString('en-US');
	const newTime = new Date(date).toLocaleTimeString('en-US');
	return `${newDate} at ${newTime}`;
};

const UserInfo = ({ session }) => (
	<div>
		<h2>User Info</h2>
		<p>Email: {session.currentUser.email}</p>
		<p>Date joined: {formatDate(session.currentUser.dateJoined)}</p>
	</div>
);

export default UserInfo;
