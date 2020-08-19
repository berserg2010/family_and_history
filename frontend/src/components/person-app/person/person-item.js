import React, { Component } from 'react';
import { withRouter } from "react-router-dom";

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Divider } from '@material-ui/core';

import { SaveBirth } from "../events/birth"
import SavePerson from './save-person'


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

const initialState = {
  expanded: 'panel2',
};

class PersonItem extends Component {
  state = {
    ...initialState
  };

  handleChange = (panel) => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  render() {
    const {
      classes,
    } = this.props;

    const { expanded } = this.state;

    return (
      <div className={classes.root}>
        <ExpansionPanel
          expanded={expanded === 'panel1'}
          onChange={this.handleChange('panel1')}
        >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="h1" variant="h5">
              Person
            </Typography>
          </ExpansionPanelSummary>

          <Divider variant="middle" />

          <SavePerson />

        </ExpansionPanel>

        <ExpansionPanel
          expanded={expanded === 'panel2'}
          onChange={this.handleChange('panel2')}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}>
            <Typography component="h1" variant="h5">
              Birth
            </Typography>
          </ExpansionPanelSummary>

          <Divider variant="middle" />

          <SaveBirth />

        </ExpansionPanel>
      </div>
    );
  }
}

PersonItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(
  withStyles(styles)(PersonItem)
);
