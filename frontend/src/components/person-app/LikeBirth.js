import React, { Component } from 'react';
import { Mutation } from "react-apollo";

import {
	LIKE_BIRTH,
	PERSON,
} from "../../queries";

import withSession from '../../CoreApp/withSession';


class LikeBirth extends Component{
	state = {
		liked: false,
		email: '',
	};

	componentDidMount() {
		if (this.props.session.currentUser){
			const { email, personAppBirthLikesRelated } = this.props.session.currentUser;
			const prevLiked = personAppBirthLikesRelated[0]
				&& this.props.session.currentUser.personAppBirthLikesRelated[0].person.id === this.props.id;
			this.setState({
				liked: prevLiked,
				email,
			});
		}
	}

	handleClick = likeBirth => {
		this.setState(prevState => ({
			liked: !prevState.liked

		}),
			() => this.handleLike(likeBirth)
		);
	};

	handleLike = likeBirth => {
		likeBirth().then(async ({data}) => {
			// console.log(data);
			await this.props.refetch();
		});
	};

	updateCache = (cache, { data: { likeBirth } }) => {
		const { id } = this.props;
		const { person } = cache.readQuery({
			query: PERSON,
			variables: { id },
		});

		cache.writeQuery({
			query: PERSON,
			variables: { id },
			data: {
				person: {
					...person,
					birth: {
						...person.birth,
						likesCount: likeBirth.birth.likesCount
					},
				}
			}
		});
	};

	render() {
		const { liked, email } = this.state;
		const { id } = this.props;

		return (
		<Mutation
			mutation={ LIKE_BIRTH }
			variables={{
				id,
				email
			}}
			update={this.updateCache}
		>
			{likeBirth =>
				email && (
					<button onClick={() => this.handleClick(likeBirth)}>

						{liked ? 'Liked' : 'Like'}
					</button>
				)
			}
		</Mutation>
		);
	}
}

export default withSession(LikeBirth);
