import React from 'react';
import { Link } from "react-router-dom";

import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import DeleteFamily from './delete-family';


const FamilyListItem = ({ item }) => {

	const { marriageSet: [ marriage ] }  = item;
	const {
		husband: { birthSet: [ husbandBirth ] },
		wife: { birthSet: [ wifeBirth ] }
	} = marriage;

	return (
		<ListItem
			key={item.id}
			role={undefined}
			alignItems="flex-start"
			dense
			button
			component={Link}
			to={`/family/${item.id}`}
		>
			<ListItemAvatar>
				<Avatar alt="Remy Sharp" src="" />
			</ListItemAvatar>

			{
				marriage
					?	<ListItemText
							primary={`${husbandBirth.givname} and ${wifeBirth.givname}`}
							secondary={`${husbandBirth.surname} (${wifeBirth.surname})`}
						/>
					: ""
			}

			<ListItemSecondaryAction>
				<DeleteFamily item={item} />
			</ListItemSecondaryAction>
		</ListItem>
	);
};

export default FamilyListItem;
