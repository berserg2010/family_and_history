import React from 'react';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';

import { withSnackbar } from "notistack";

import SaveFamilyItem from './save-family-item'
import Loading from "../../../CoreApp/Loading";
import Error from "../../../CoreApp/Error";
import {
  FAMILY,
} from '../../../queries';


const SaveFamily = ({ family={}, loading, error }) => {
  if (loading) return <Loading />;
  if (error) return <Error error={error}/>;

  return(
    <SaveFamilyItem data={family} />
  )
};

const withQuery = graphql(FAMILY, {
  props: ({ data: { family, loading, error } }) => ({
    family, loading, error
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
    withQuery(SaveFamily)
));
