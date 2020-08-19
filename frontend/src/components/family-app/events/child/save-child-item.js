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

import { withSnackbar } from "notistack";

import TextFieldInput from '../../../text-field-input'
import IntegrationAutosuggest from '../../../autosuggest-field-input';

import {
	SAVE_CHILD,
	ALL_CHILD,
} from "../../../../queries";
import RadioFieldInput from "../../../radio-field-input";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";


const getName = ({ surname, givname }) => {
	return `${surname} ${givname}`
};

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

const SaveChildItem = ({ classes, data, mutate, attrs, history, match }) => {

	const [ birth, setBirth ] = useState(data.birth ? data.birth.id : null);
	const [ reltofath, setReltofath ] = useState(data.reltofath || 'B');
	const [ reltomoth, setReltomoth ] = useState(data.reltomoth || 'B');

	const [ childnbrfath, setChildnbrfath ] = useState(data.childnbrfath || null);
	const [ childnbrmoth, setChildnbrmoth ] = useState(data.childnbrmoth || null);

	const handleSubmit = (event, mutate) => {
		event.preventDefault();

		mutate({ variables: {
			data: {
				id: data ? data.id : null,
				idFamily: match.params ? match.params.id : null,
				idBirth: birth,
				reltofath,
				reltomoth,
				childnbrfath,
				childnbrmoth,

			}
		}})
			.then(({ data }) => {
				setBirth(null);
				setReltofath('B');
				setReltomoth('B');
				setChildnbrfath(undefined);
				setChildnbrmoth(undefined);
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
					<IntegrationAutosuggest
						name="birth"
						value={birth}
						handleChange={setBirth}
						dataName={data.birth && getName(data.birth)}
					/>

				</Grid>
			</ExpansionPanelDetails>

			<ExpansionPanelDetails>
				<Grid container
				      justify="center">
					<RadioFieldInput
						name="reltofath"
						value={reltofath}
						handleChange={(event) => {setReltofath(event.target.value)}}
					>
						<FormControlLabel value="B" control={<Radio />} label="Biological" />
						<FormControlLabel value="A" control={<Radio />} label="Adopted" />
						<FormControlLabel value="F" control={<Radio />} label="Foster" />
						<FormControlLabel value="S" control={<Radio />} label="Sealing" />
					</RadioFieldInput>
				</Grid>

				<Grid container
				      justify="center">
					<RadioFieldInput
						name="reltomoth"
						value={reltomoth}
						handleChange={(event) => {setReltomoth(event.target.value)}}
					>
						<FormControlLabel value="B" control={<Radio />} label="Biological" />
						<FormControlLabel value="A" control={<Radio />} label="Adopted" />
						<FormControlLabel value="F" control={<Radio />} label="Foster" />
						<FormControlLabel value="S" control={<Radio />} label="Sealing" />
					</RadioFieldInput>
				</Grid>
			</ExpansionPanelDetails>

			<ExpansionPanelDetails>
				<Grid container
							justify="center">
					<TextFieldInput
						name="childnbrfath"
						value={childnbrfath || ''}
						handleChange={(event) => {setChildnbrfath(event.target.value)}} />

					<TextFieldInput
						name="childnbrmoth"
						value={childnbrmoth || ''}
						handleChange={(event) => {setChildnbrmoth(event.target.value)}} />
				</Grid>
			</ExpansionPanelDetails>

			<Divider variant="middle"/>

			<ExpansionPanelActions>
				<Button
					color="primary"
					className={classes.submit}
					type='submit'
					variant="contained"
					disabled={attrs.loading}
				>Submit</Button>
			</ExpansionPanelActions>
		</form>
	);
};

const withMutation = graphql(SAVE_CHILD, {
	props: ({ mutate, attrs = {} }) => ({
		mutate,
		attrs,
	}),

	options: (props) => ({
		refetchQueries: [
			{ query: ALL_CHILD },
		],

		onCompleted: () => {
			props.enqueueSnackbar(`Child data saved!`,	{ variant: 'success' })
		},

		onError: (error) => {
			props.enqueueSnackbar(`${error}`,	{ variant: 'error' })
		}
	})
});

SaveChildItem.propTypes = {
	classes: PropTypes.object.isRequired,
	enqueueSnackbar: PropTypes.func.isRequired,
};

export default withRouter(
	withSnackbar(
			withStyles(styles)(
				withMutation(SaveChildItem)
)));
