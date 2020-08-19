import React, { useState } from 'react';
import { withRouter } from "react-router-dom";

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Divider } from '@material-ui/core';

import SaveFamily from './save-family'
import { SaveMarriage } from "../events/marriage"
import { SaveChild } from "../events/child"


const styles = (theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
});

const FamilyItem = ({ classes }) => {
  const [expanded, setExpanded] = useState('panel2');

  const handleChange = (panel) => (event, expanded) => {
    setExpanded(expanded ? panel : false)
  };

  return (
    <div className={classes.root}>
      <ExpansionPanel
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography component="h1" variant="h5">
            Family
          </Typography>
        </ExpansionPanelSummary>

        <Divider variant="middle" />

        <SaveFamily />

      </ExpansionPanel>

      <ExpansionPanel
        expanded={expanded === 'panel2'}
        onChange={handleChange('panel2')}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography component="h1" variant="h5">
            Marriage
          </Typography>
        </ExpansionPanelSummary>

        <Divider variant="middle" />

        <SaveMarriage />

      </ExpansionPanel>

      <ExpansionPanel
        expanded={expanded === 'panel3'}
        onChange={handleChange('panel3')}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography component="h1" variant="h5">
            Child
          </Typography>
        </ExpansionPanelSummary>

        <Divider variant="middle" />

        <SaveChild />

      </ExpansionPanel>
    </div>
  );
};

FamilyItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(
  withStyles(styles)(FamilyItem)
);
