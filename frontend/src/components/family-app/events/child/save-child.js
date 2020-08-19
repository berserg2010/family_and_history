import React from 'react';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';

import { withSnackbar } from "notistack";

import {
  ALL_CHILD,
} from "../../../../queries";

import SaveChildItem from './save-child-item'
import Loading from "../../../../CoreApp/Loading";
import Error from "../../../../CoreApp/Error";


const SaveChild = ({ allChild=[], loading, error }) => {

  if (loading) return <Loading />;
  if (error) return <Error error={error}/>;

  return(
    <SaveChildItem data={allChild[0] || {}} />
  )
};

const withQuery = graphql(ALL_CHILD, {
  props: ({ data: { allChild, loading, error } }) => ({
    allChild, loading, error
  }),

  skip: ({ match: { params: { id } } }) => {
    return !id
  },

  options: ({ match: { params: { id } } }) => ({
    variables: {
      id_family: id
    }
  })
});

export default withRouter(
  withSnackbar(
    withQuery(SaveChild)
));
