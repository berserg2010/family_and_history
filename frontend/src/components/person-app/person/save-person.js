import React from 'react';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';

import { withSnackbar } from "notistack";

import SavePersonItem from './save-person-item'
import Loading from "../../../CoreApp/Loading";
import Error from "../../../CoreApp/Error";
import {
  PERSON,
} from '../../../queries';


const SavePerson = ({ person={}, loading, error }) => {

  if (loading) return <Loading />;
  if (error) return <Error error={error}/>;

  return(
    <SavePersonItem data={person} />
  )
};

const withQuery = graphql(PERSON, {
  props: ({ data: { person, loading, error } }) => ({
    person, loading, error
  }),
  skip: ({ match: { params: { id } } }) => {
    return !id
  },
  options: ({ match: { params: { id } } }) => ({
    variables: {
      id: id
    }
  })
});

export default withRouter(
  withSnackbar(
    withQuery(SavePerson)
));
