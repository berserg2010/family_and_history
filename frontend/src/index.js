import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { SnackbarProvider } from 'notistack';

import App from './components/app';
import { InMemoryCache } from "apollo-cache-inmemory";


const cache = new InMemoryCache();

const client = new ApolloClient({
	uri: 'http://0.0.0.0:8080/graphql/',
	cache,

//	fetchOptions: {	credentials: 'include' },
	fetchOptions: {	credentials: 'same-origin' },

	request: (operation) => {
		const token = localStorage.getItem('token') || '';

		operation.setContext({
			headers: {
				authorization: `JWT ${token}`
				// http_authorization: `JWT ${token}`
			}
		});
	},

	// onError: ({ networkError }) => {
	// 	if (networkError){
	// 		console.log('Network Error', networkError);
	// 		// if (networkError.statusCode === 401){
	// 		// 	localStorage.removeItem('token')
	// 		// }
	// 		// localStorage.setItem('token', '')
	// 	}
	// }
});

// console.log('Cache_data: ', cache.data.data );

ReactDOM.render(
	<ApolloProvider client={client}>
		<Router>
			<SnackbarProvider
				maxSnack={3}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				hideIconVariant={false}
			>
      	<App />
			</SnackbarProvider>
		</Router>
	</ApolloProvider>,
  document.getElementById('root')
);
