import React from "react";

import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


const styles = (theme) => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

const fcUC = (string) => {
  if (!string) return null;

  return (
    `${String.fromCodePoint(string.charCodeAt(0)).toUpperCase()}${string.slice(1)}`
  )
};

const TextFieldInput = ({ name, value, classes, handleChange, ...other }) => {
  return (
    <TextField
      // autoComplete=""
      // autoFocus
      id={name}
      label={fcUC(name)}
      margin="normal"
      name={name}
      onChange={handleChange}
      value={value}

      className={classes.textField}
      variant="outlined"
      {...other}
    />
  )
};

TextFieldInput.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TextFieldInput);
