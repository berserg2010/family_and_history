import React, { Component } from 'react';
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
	ALL_PERSON,
	PERSON,
	SAVE_PERSON
} from '../../../queries';


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

const initialState = {
	data: {
		note: '',
	}
};

const parseData = (data) => {
	if (!data) return ;

	const {
		note,
	} = data;

	return {
		note,
	};
};

class SavePersonItem extends Component {

	state = {
		data: {
			...initialState.data,
			...parseData(this.props.data),
		}
	};

	clearState = () => {
		this.setState({ ...initialState });
	};

	handleEditorChange = (event) => {
		const newContent = event.editor.getData();
		this.setState({
			data: {
				...this.state.data,
				note: newContent,
			},
		})
	};

	handleSubmit = (event, mutate) => {
		event.preventDefault();

		mutate({ variables: {
			"data": {
				id: this.props.data ? this.props.data.id : null,
				...this.state.data }
		}})
			.then(({ data }) => {
				this.clearState();
				this.props.history.push('/person');
			})
	};

	validateForm = () => {
		const {
			data,
		} = this.state;
		return !(data.surname || data.givname)
	};

	updateCache = (cache, { data: { savePerson } }) => {
		const { person } = cache.readQuery({
			query: PERSON,
			variables: { id: savePerson.id }
		});

		cache.writeQuery({
			query: PERSON,
			data: {
				person: [...person, ...savePerson]
				// allPerson: allPerson.concat([createPerson])
			}
		});
	};

	render() {

		const {
			data: {
				note,
		}} = this.state;

		const {
			mutate,
			attrs,
			classes,
		} = this.props;

		return (
			<form
				// className={classes.form}
				noValidate
				autoComplete="off"
				onSubmit={(event) => this.handleSubmit(event, mutate)}
			>
				<ExpansionPanelDetails>
					<Grid container
					      justify="center">
						<CKEditor
							name='note'
							margin="normal"
							content={note}
							events={{
								change: this.handleEditorChange,
							}}
						/>
					</Grid>
				</ExpansionPanelDetails>

				<Divider variant="middle"/>

				<ExpansionPanelActions>
					<Button
						color="primary"
						className={classes.submit}
						type='submit'
						variant="contained"
						// disabled={attrs.loading || this.validateForm()}
						disabled={attrs.loading}
					>Submit</Button>
				</ExpansionPanelActions>

			</form>
		);
	}
}

const withMutation = graphql(SAVE_PERSON, {
	props: ({ mutate, attrs = {} }) => ({
		mutate,
		attrs,
	}),

	options: (props) => ({
		refetchQueries: [
			{ query: ALL_PERSON },
		],

		// update: (cache, { data: { savePerson } }) => {
		// 	const { person } = cache.readQuery({
		// 		query: PERSON,
		// 		variables: { "id": savePerson.person.id }
		// 	});
		//
		// 	cache.writeQuery({
		// 		query: PERSON,
		// 		data: {
		// 			person: [ ...person, ...savePerson.person ]
		// 			// allPerson: allPerson.concat([createPerson])
		// 		}
		// 	});
		// },

		onCompleted: () => props.enqueueSnackbar(
			`Person data saved!`,
			{ variant: 'success' }
		),

		onError: (error) => props.enqueueSnackbar(
			`${error}`,
			{ variant: 'error' }
		)
	})
});

SavePersonItem.propTypes = {
	classes: PropTypes.object.isRequired,
	enqueueSnackbar: PropTypes.func.isRequired,
};

export default withRouter(
	withSnackbar(
		withStyles(styles)(
			withMutation(SavePersonItem)
)));
