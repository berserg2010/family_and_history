import React, { Component, Fragment } from 'react';

import {
	withAuth,
} from '../../CoreApp'

import Header from './header'
import Nav from './nav';
import Main from './main'


class Dashboard extends Component{
	state = {
		open: true,
	};

	handleDrawerOpen = () => {
		this.setState({ open: true });
	};

	handleDrawerClose = () => {
		this.setState({ open: false });
	};

	render() {

		const { open } = this.state;

		return (
			<Fragment>
				<Header position="absolute"
								open={open}
								handleDrawerOpen={this.handleDrawerOpen} />

				<Nav open={open}
						 handleDrawerClose={this.handleDrawerClose} />

				<Main />
			</Fragment>
		);
	}
}

export default withAuth(Dashboard);
