import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Divider from '@material-ui/core/Divider';

import CKEditor from "react-ckeditor-component";

import { withSnackbar } from "notistack";

import {
	ALL_FAMILY,
	FAMILY,
	SAVE_FAMILY
} from "../../../queries";


const styles = (theme) => ({
	root: {
		...theme.mixins.gutters(),
		paddingTop: theme.spacing.unit * 2,
		paddingBottom: theme.spacing.unit * 2,
		marginBottom: theme.spacing.unit * 2,
	},
	form: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	submit: {
		margin: theme.spacing.unit * 2,
	},
});

const SaveFamilyItem = ({ classes, data, mutate, attrs, history }) => {

	const [ note, setNote ] = useState(data.note || '');

	const handleSubmit = (event, mutate) => {
		event.preventDefault();

		mutate({ variables: {
			"data": {
				id: data ? data.id : null,
				note,
			}
		}})
			.then(() => {
				setNote('');
				history.push('/family');
			})
	};

	return (
		<form
			// className={classes.form}
			noValidate
			autoComplete="off"
			onSubmit={(event) => handleSubmit(event, mutate)}
		>
			<ExpansionPanelDetails>
				<Grid container
				      justify="center">
					<CKEditor
						name='note'
						margin="normal"
						content={note}
						events={{
							change: (event) => setNote(event.editor.getData()),
						}}
					/>
				</Grid>
			</ExpansionPanelDetails>

			<Divider variant="middle"/>

			<ExpansionPanelActions>
				<Button
					color="primary"
					className={classes.submit}
					type="submit"
					variant="contained"
					disabled={attrs.loading}
				>Submit</Button>
			</ExpansionPanelActions>
		</form>
	);
};

const withMutation = graphql(SAVE_FAMILY, {
	props: ({ mutate, attrs = {} }) => ({
		mutate,
		attrs,
	}),

	options: (props) => ({
		refetchQueries: [
			props.data.id
				? { query: FAMILY, variables: { 'id': props.data.id }}
				: { query: ALL_FAMILY },
		],

		onCompleted: () => {
			props.enqueueSnackbar(`Family data saved!`,	{ variant: 'success' });
		},

		onError: (error) => {
			props.enqueueSnackbar(`${error}`,	{ variant: 'error' })
		}
	})
});

SaveFamilyItem.propTypes = {
	classes: PropTypes.object.isRequired,
	enqueueSnackbar: PropTypes.func.isRequired,
};

export default withRouter(
	withSnackbar(
		withStyles(styles)(
			withMutation(SaveFamilyItem)
)));
