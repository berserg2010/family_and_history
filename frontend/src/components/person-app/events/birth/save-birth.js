import React from 'react';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';

import { withSnackbar } from "notistack";

import {
  ALL_BIRTH,
} from "../../../../queries";
import SaveBirthItem from './save-birth-item'
import Loading from "../../../../CoreApp/Loading";
import Error from "../../../../CoreApp/Error";


const SaveBirth = ({ allBirth={}, loading, error }) => {

  if (loading) return <Loading />;
  if (error) return <Error error={error}/>;

  return(
    <SaveBirthItem data={allBirth[0]} />
  )
};

const withQuery = graphql(ALL_BIRTH, {
  props: ({ data: { allBirth, loading, error } }) => ({
    allBirth, loading, error
  }),

  skip: ({ match: { params: { id } } }) => {
    return !id
  },

  options: ({ match: { params: { id } } }) => ({
    variables: {
      id_person: id
    }
  })
});

export default withRouter(
  withSnackbar(
    withQuery(SaveBirth)
));
