import React, { Fragment } from 'react'
import { Link as RouterLink, withRouter } from 'react-router-dom'
import { graphql } from 'react-apollo';

import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from "@material-ui/core/Button";
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';

import {
  ALL_PERSON,
} from '../../../queries';

import Loading from "../../../CoreApp/Loading";
import Error from "../../../CoreApp/Error";
import PersonListItem from "./person-list-item";


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

const PersonList = ({ allPerson, loading, error, classes }) => {
  if (loading) return <Loading />;
  if (error) return <Error error={error}/>;

  return (
    <Fragment>
      <Typography component="h1" variant="h5">
        Persons
      </Typography>

      <Button
        color="primary"
        variant="outlined"
        className={classes.button}
        component={RouterLink}
        to={`/person/add`}
      >Add person</Button>

      {
        allPerson.length ?
        <List className={classes.root}>
          {allPerson.map(item => (
            <PersonListItem key={item.id} item={item}/>
          ))}
        </List> : ""
      }
    </Fragment>
  )
};

const withQuery = graphql(ALL_PERSON, {
  props: ({ data: { allPerson, loading, error }}) => ({
    allPerson,
    loading,
    error,
  })
});

PersonList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(
    withStyles(styles)(
      withQuery(PersonList)
));
