import React, { Component } from 'react';
import { ApolloConsumer } from "react-apollo";

import { SEARCH_PERSON } from "../queries";

import SearchItem from './SearchItem'


class Search extends Component {
	state = {
		searchResults: [],
	};

	handleChange = ({ searchPerson }) => {
		this.setState({
			searchResults: searchPerson,
		})
	};

	render() {
		const { searchResults } = this.state;

		return (
			<ApolloConsumer>
			{client => (
				<div>
					<input
						type='search'
						placeholder='Search'
						onChange={async event => {
						 event.persist();
						 const { data } = await client.query({
							 query: SEARCH_PERSON,
							 variables: {searchTerm: event.target.value}
						 });
						 this.handleChange(data);
						}}
					/>
					<ul>
						{searchResults.map(item => (
							<SearchItem key={item.id} { ...item }/>
						))}
					</ul>
				</div>
			)}
			</ApolloConsumer>
		);
}}

export default Search;
