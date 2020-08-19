import React from 'react';
import { Link } from "react-router-dom";


const SearchItem = ({ id, birth }) => (
	<li>
		<Link to={`/person/${id}`}>
			{birth.givname && birth.givname}{` `}
			{birth.surname && birth.surname}
		</Link>
	</li>
);

export default SearchItem;
