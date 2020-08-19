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
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";

import CKEditor from "react-ckeditor-component";

import { withSnackbar } from "notistack";

import TextFieldInput from '../../../text-field-input'
import RadioFieldInput from '../../../radio-field-input'

import {
	ALL_BIRTH,
	SAVE_BIRTH,
	ALL_PERSON,
} from "../../../../queries";


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
		gender: 'U',
		givname: '',
		surname: '',
		year: undefined,
		month: undefined,
		day: undefined,
		hour: undefined,
		minute: undefined,
		note: '',
		// email: '',
	}
};

const parseData = (data) => {
	if (!data) return ;

	const {
		gender,
		givname,
		surname,
		note,
		datetime,
	} = data;

	return {
		gender,
		givname,
		surname,
		note,
		...JSON.parse(datetime),
	};
};

class SaveBirthItem extends Component {

	state = {
		data: {
			...initialState.data,
			...parseData(this.props.data),
		}
	};

	clearState = () => {
		this.setState({ ...initialState });
	};

	handleChange = (event) => {
		// const name = event.target.name.split("-");
		const name = event.target.name;
		const { value } = event.target;
		this.setState({
			data: {
				...this.state.data,
				[name]: value,
			},
		});
	};

	handleChangeNumber = (event) => {
		// const name = event.target.name.split("-");
		const name = event.target.name;
		const { value } = event.target;
		this.setState({
			data: {
				...this.state.data,
				[name]: Number(value) ? Number(value): null,
			},
		});
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
				idPerson: this.props.match.params ? this.props.match.params.id : null,
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

	updateCache = (cache, { data: { saveBirth } }) => {
		const { allPerson } = cache.readQuery({
			query: ALL_BIRTH
		});

		cache.writeQuery({
			query: ALL_PERSON,
			data: {
				allPerson: [saveBirth, ...allPerson]
				// allPerson: allPerson.concat([createPerson])
			}
		});
	};

	render() {

		const {
			data: {
				gender,
				givname,
				surname,
				year,
				month,
				day,
				hour,
				minute,
				note,
			},
		} = this.state;

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
						<RadioFieldInput
							name={`gender`}
							value={gender}
							handleChange={this.handleChange}
						>
							<FormControlLabel value="U" control={<Radio />} label="Unknown" />
							<FormControlLabel value="M" control={<Radio />} label="Male" />
							<FormControlLabel value="F" control={<Radio />} label="Female" />
						</RadioFieldInput>
					</Grid>
				</ExpansionPanelDetails>

				<ExpansionPanelDetails>
					<Grid container
					      justify="center">
						<TextFieldInput
							name={`givname`}
							value={givname}
							handleChange={this.handleChange} />

						<TextFieldInput
							name={`surname`}
							value={surname}
							handleChange={this.handleChange} />
					</Grid>
				</ExpansionPanelDetails>

				<ExpansionPanelDetails>
					<Grid container
					      justify="center">
						<TextFieldInput
							name={`year`}
							value={year || ""}
							handleChange={this.handleChangeNumber} />

						<TextFieldInput
							name={`month`}
							value={month || ""}
							handleChange={this.handleChangeNumber} />

						<TextFieldInput
							name={`day`}
							value={day || ""}
							handleChange={this.handleChangeNumber} />
					</Grid>
				</ExpansionPanelDetails>

				<ExpansionPanelDetails>
					<Grid container
					      justify="center">
						<TextFieldInput
							name={`hour`}
							value={hour || ""}
							handleChange={this.handleChangeNumber} />

						<TextFieldInput
							name={`minute`}
							value={minute || ""}
							handleChange={this.handleChangeNumber} />
					</Grid>
				</ExpansionPanelDetails>

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
						disabled={attrs.loading || this.validateForm()}
					>Submit</Button>
				</ExpansionPanelActions>

			</form>
		);
	}
}

const withMutation = graphql(SAVE_BIRTH, {
	props: ({ mutate, attrs = {} }) => ({
		mutate,
		attrs,
	}),

	options: (props) => ({
		refetchQueries: [
			{ query: ALL_PERSON },
		],

		// update: {this.updateCache}

		onCompleted: () => props.enqueueSnackbar(
			`Birth data saved!`,
			{ variant: 'success' }
		),

		onError: (error) => props.enqueueSnackbar(
			`${error}`,
			{ variant: 'error' }
		)
	})
});

SaveBirthItem.propTypes = {
	classes: PropTypes.object.isRequired,
	enqueueSnackbar: PropTypes.func.isRequired,
};

export default withRouter(
	withSnackbar(
			withStyles(styles)(
				withMutation(SaveBirthItem)
)));
