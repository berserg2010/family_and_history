import React from 'react';
import { graphql } from "react-apollo";

import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from "@material-ui/core/Grid";

import {
	CURRENT_USER,
	ALL_FAMILY,
	DELETE_FAMILY,
} from '../../../queries';


const handleDelete = (mutate) => {
	const confirmDelete = window.confirm('Are you sure you want to delete this family?');

	if (confirmDelete){
		mutate()
			.then(({ data }) => {})
	}
};

const DeleteFamily = ({ mutate, attrs } ) => {
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

const withMutation = graphql(DELETE_FAMILY, {
	props: ({ mutate, attrs = {} }) => ({
		mutate,
		attrs,
	}),
	options: (props) => ({
		variables: { id: props.item.id },
		refetchQueries: [
			{ query: ALL_FAMILY },
			{ query: CURRENT_USER }
		],

		update: (cache, { data: deleteFamily }) => {
			const { allFamily } = cache.readQuery({
				query: ALL_FAMILY,
				// variables: {}
			});
			cache.writeQuery({
				query: ALL_FAMILY,
				// variables: {},
				data: {
					allPerson: allFamily.filter((item) => item.id !== deleteFamily.id)

				}
			})
		},
	})
});

export default withMutation(DeleteFamily);
