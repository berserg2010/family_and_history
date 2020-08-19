import React from 'react';
import { withRouter } from "react-router-dom";
import { ApolloConsumer } from 'react-apollo';

import MenuItem from "@material-ui/core/MenuItem";


const handleSignout = (client, history) => {
  // console.log("Signout");
  localStorage.setItem('token', '');
  client.resetStore();
  history.push('/');
};

const Signout = ({ history }) => (
  <ApolloConsumer>
    {(client) => {
      return (
        <MenuItem
          onClick={() => handleSignout(client, history)}
        >Signout</MenuItem>
      )
    }}
  </ApolloConsumer>
);

export default withRouter(Signout);
