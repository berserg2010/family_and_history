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

import TextFieldInput from '../../../text-field-input'
import IntegrationAutosuggest from '../../../autosuggest-field-input';

import {
	MARRIAGE,
	SAVE_MARRIAGE,
	ALL_FAMILY,
} from "../../../../queries";


const getName = ({ birthSet }) => {
	const { surname, givname } = birthSet[0];
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

const SaveMarriageItem = ({ classes, data, mutate, attrs, history, match }) => {
	const [ husband, setHusband ] = useState(data.husband ? data.husband.id : null);
	const [ wife, setWife ] = useState(data.wife ? data.wife.id : null);
	const [ husbname, setHusbname ] = useState(data.husbname || '');
	const [ wifename, setWifename ] = useState(data.wifename || '');
	const [ note, setNote ] = useState(data.note || '');

	const datetime = data.datetime
		? JSON.parse(data.datetime)
		: {};
	const [ year, setYear ] = useState(datetime.year || null);
	const [ month, setMonth ] = useState(datetime.month || null);
	const [ day, setDay ] = useState(datetime.day || null);
	const [ hour, setHour ] = useState(datetime.hour || null);
	const [ minute, setMinute ] = useState(datetime.minute || null);

	const handleSubmit = (event, mutate) => {
		event.preventDefault();

		mutate({ variables: {
			data: {
				id: data ? data.id : null,
				idFamily: match.params ? match.params.id : null,
				husband: husband,
				wife: wife,
				husbname,
				wifename,
				note,

				year,
				month,
				day,
				hour,
				minute,
			}
		}})
			.then(({ data }) => {
				setHusband(null);
				setWife(null);
				setHusbname('');
				setWifename('');
				setYear(undefined);
				setMonth(undefined);
				setDay(undefined);
				setHour(undefined);
				setMinute(undefined);
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
					<IntegrationAutosuggest
						name="husband"
						value={husband}
						handleChange={setHusband}
						dataName={data.husband && getName(data.husband)}
					/>

					<IntegrationAutosuggest
						name="wife"
						value={wife}
						handleChange={setWife}
						dataName={data.wife && getName(data.wife)}
					/>
				</Grid>
			</ExpansionPanelDetails>

			<ExpansionPanelDetails>
				<Grid container
				      justify="center">
					<TextFieldInput
						name="husbname"
						value={husbname}
						handleChange={(event) => {setHusbname(event.target.value)}} />

					<TextFieldInput
						name="wifename"
						value={wifename}
						handleChange={(event) => {setWifename(event.target.value)}} />
				</Grid>
			</ExpansionPanelDetails>

			<ExpansionPanelDetails>
				<Grid container
							justify="center">
					<TextFieldInput
						name="year"
						value={year || ''}
						handleChange={(event) => {setYear(event.target.value)}} />

					<TextFieldInput
						name="month"
						value={month || ''}
						handleChange={(event) => {setMonth(event.target.value)}} />

					<TextFieldInput
						name="day"
						value={day || ''}
						handleChange={(event) => {setDay(event.target.value)}} />
				</Grid>
			</ExpansionPanelDetails>

			<ExpansionPanelDetails>
				<Grid container
							justify="center">
					<TextFieldInput
						name="hour"
						value={hour || ''}
						handleChange={(event) => {setHour(event.target.value)}} />

					<TextFieldInput
						name="minute"
						value={minute || ''}
						handleChange={(event) => {setMinute(event.target.value)}} />
				</Grid>
			</ExpansionPanelDetails>

			<ExpansionPanelDetails>
				<Grid container
				      justify="center">
					<CKEditor
						name="note"
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
					type='submit'
					variant="contained"
					disabled={attrs.loading}
				>Submit</Button>
			</ExpansionPanelActions>
		</form>
	);
};

const withMutation = graphql(SAVE_MARRIAGE, {
	props: ({ mutate, attrs = {} }) => ({
		mutate,
		attrs,
	}),

	options: (props) => ({
		refetchQueries: [
			props.data.id
				? { query: MARRIAGE, variables: { 'id': props.data.id }}
				: { query: ALL_FAMILY },
		],

		onCompleted: () => {
			props.enqueueSnackbar(`Marriage data saved!`,	{ variant: 'success' })
		},

		onError: (error) => {
			props.enqueueSnackbar(`${error}`,	{ variant: 'error' })
		}
	})
});

SaveMarriageItem.propTypes = {
	classes: PropTypes.object.isRequired,
	enqueueSnackbar: PropTypes.func.isRequired,
};

export default withRouter(
	withSnackbar(
			withStyles(styles)(
				withMutation(SaveMarriageItem)
)));
