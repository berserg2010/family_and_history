import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { OutlinedInput } from "@material-ui/core";


const styles = (theme) => ({
	formControl: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: 229,
	},
});

const fcUC = (string) => {
	return (
		`${String.fromCodePoint(string.charCodeAt(0)).toUpperCase()}${string.slice(1)}`
	)
};

const SelectFieldInput = ({ classes, name, value, handleChange }) => {

	const [open, setOpen] = useState(false);

	return (
		<FormControl
			className={classes.formControl}
			margin="normal"
			variant="outlined"
		>
			<InputLabel
				htmlFor={name}
			>{fcUC(name)}</InputLabel>

			<Select
				open={open}
				onClose={setOpen(false)}
				onOpen={setOpen(true)}
				value={value}
				onChange={handleChange}
				input={
					<OutlinedInput
						labelWidth={0}
						name={fcUC(name)}
						id={name}
					/>
				}
			>
				<MenuItem value="">
					<em>None</em>
				</MenuItem>
				<MenuItem value={10}>Ten</MenuItem>
				<MenuItem value={20}>Twenty</MenuItem>
				<MenuItem value={30}>Thirty</MenuItem>
			</Select>
		</FormControl>
	);
};

SelectFieldInput.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectFieldInput);
