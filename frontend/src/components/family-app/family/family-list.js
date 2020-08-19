import React, { Fragment } from 'react'
import { Link as RouterLink, withRouter } from 'react-router-dom'
import { graphql } from 'react-apollo';

import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from "@material-ui/core/Button";
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';

import {
  ALL_FAMILY,
} from "../../../queries";

import FamilyListItem from "./family-list-item";
import Loading from "../../../CoreApp/Loading";
import Error from "../../../CoreApp/Error";


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

const FamilyList = ({ allFamily, loading, error, classes }) => {

  if (loading) return <Loading />;
  if (error) return <Error error={error}/>;

  return (
    <Fragment>
      <Typography component="h1" variant="h5">
        Families
      </Typography>

      <Button
        color="primary"
        variant="outlined"
        className={classes.button}
        component={RouterLink}
        to={`/family/add`}
      >Add family</Button>

      {
        allFamily.length
          ? <List className={classes.root}>
              {allFamily.map(item => (
                <FamilyListItem key={item.id} item={item}/>
              ))}
            </List>
          : ''
      }
    </Fragment>
  )
};

const withQuery = graphql(ALL_FAMILY, {
  props: ({ data: { allFamily, loading, error }}) => ({
    allFamily, loading, error
  })
});

FamilyList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(
    withStyles(styles)(
      withQuery(FamilyList)
));
