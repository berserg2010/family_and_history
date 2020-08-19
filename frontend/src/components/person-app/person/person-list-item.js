import React from 'react';
import { Link } from "react-router-dom";

import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import DeletePerson from './delete-person';


const PersonListItem = (props) => {
	const {
		item,
	} = props;

	return (
		<ListItem
			key={item.id}
			role={undefined}
			alignItems="flex-start"
			dense
			button
			component={Link}
			to={`/person/${item.id}`}
		>
			<ListItemAvatar>
				<Avatar alt="Remy Sharp" src="" />
			</ListItemAvatar>

			{
				item.birthSet.length ?
				<ListItemText
					primary={item.birthSet[0].givname && item.birthSet[0].givname}
					secondary={item.birthSet[0].surname && item.birthSet[0].surname}
				/> : ""
			}

			<ListItemSecondaryAction>
				<DeletePerson item={item} />
			</ListItemSecondaryAction>
		</ListItem>
	);
};

export default PersonListItem;
