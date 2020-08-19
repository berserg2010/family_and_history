import React from "react";

import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import { withStyles } from '@material-ui/core/styles';


const styles = (theme) => ({
  formControl: {
    margin: theme.spacing.unit * 3,
    marginBottom: 0,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
});

const fcUC = (string) => {
  return (
    `${String.fromCodePoint(string.charCodeAt(0)).toUpperCase()}${string.slice(1)}`
  )
};

const RadioFieldInput = ({ name, value, classes, handleChange, children }) => {

  return (
    <FormControl
      component="fieldset"
      className={classes.formControl}
    >
      <FormLabel
        component="legend"
      >{fcUC(name)}</FormLabel>
      <RadioGroup
        id={name}
        className={classes.group}
        aria-label={fcUC(name)}
        name={name}
        onChange={handleChange}
        value={value}
      >
        {children}
      </RadioGroup>
    </FormControl>
  )
};

RadioFieldInput.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RadioFieldInput);
