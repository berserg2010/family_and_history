import React from 'react';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';

import { withSnackbar } from "notistack";

import {
  ALL_MARRIAGE,
} from "../../../../queries";

import SaveMarriageItem from './save-marriage-item'
import Loading from "../../../../CoreApp/Loading";
import Error from "../../../../CoreApp/Error";


const SaveMarriage = ({ allMarriage=[], loading, error }) => {

  if (loading) return <Loading />;
  if (error) return <Error error={error}/>;

  return(
    <SaveMarriageItem data={allMarriage[0] || {}} />
  )
};

const withQuery = graphql(ALL_MARRIAGE, {
  props: ({ data: { allMarriage, loading, error } }) => ({
    allMarriage, loading, error
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
    withQuery(SaveMarriage)
));
