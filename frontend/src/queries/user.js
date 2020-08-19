import { gql } from 'apollo-boost';


// USER
export const CURRENT_USER = gql`
	query CurrentUser{
	  currentUser{
	    id
	    email
	    firstName
	    lastName
	    dateJoined
      personAppBirthLikesSet{
        person{
          id
		    }
		  }
	  }
	}
`;
