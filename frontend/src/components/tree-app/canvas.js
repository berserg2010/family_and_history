
import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'

import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';


const styles = (theme) => ({
  root: {
    // width: '100%',
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  button: {
    margin: theme.spacing.unit * 2,
    marginLeft: 0,
  },
});

const Canvas = () => {
  return (
    <Fragment>
      <Typography component="h1" variant="h5">
        Tree
      </Typography>

    </Fragment>
  )
};

Canvas.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(
  withStyles(styles)(Canvas)
);
