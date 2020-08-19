import React from 'react';
import { graphql } from "react-apollo";

import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from "@material-ui/core/Grid";

import {
	CURRENT_USER,
	ALL_PERSON,
	DELETE_PERSON,
} from '../../../queries';


const handleDelete = (mutate) => {
	const confirmDelete = window.confirm('Are you sure you want to delete this person?');

	if (confirmDelete){
		mutate()
			.then(({ data }) => {})
	}
};

const DeletePerson = ({ mutate, attrs } ) => {
	return (
		<Grid>
			<IconButton
				color="secondary"
				aria-label="Delete"
				onClick={() => handleDelete(mutate)}>

				{
					attrs.loading
					? <CircularProgress color="secondary"/>
					:	<DeleteIcon />
				}
			</IconButton>
		</Grid>
	)
};

const withMutation = graphql(DELETE_PERSON, {
	props: ({ mutate, attrs = {} }) => ({
		mutate,
		attrs,
	}),
	options: (props) => ({
		variables: { id: props.item.id },
		refetchQueries: [
			{ query: ALL_PERSON },
			{ query: CURRENT_USER }
		],

		update: (cache, { data: deletePerson }) => {
			const { allPerson } = cache.readQuery({
				query: ALL_PERSON,
				// variables: {}
			});
			cache.writeQuery({
				query: ALL_PERSON,
				// variables: {},
				data: {
					allPerson: allPerson.filter((item) => item.id !== deletePerson.id)

				}
			})
		},
	})
});

export default withMutation(DeletePerson);
