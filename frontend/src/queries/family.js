import { gql } from "apollo-boost";

import {
	marriageFragment,
	familyFragment,
	responseField,
} from './fragments';


// FAMILY
export const ALL_FAMILY = gql`
query AllFamily{
  allFamily{
		...familyField
  }
}
${familyFragment.familyField}
`;

export const FAMILY = gql`
query Family($id: ID!){
  family(id: $id){
		...familyField
  }
}
${familyFragment.familyField}
`;

export const SAVE_FAMILY = gql`
mutation SaveFamily($data: FamilyInput){
  saveFamily(data: $data){
    family{
      id
    },
    ${responseField}
  }
}
`;

export const DELETE_FAMILY = gql`
  mutation DeleteFamily($id: ID!){
    deleteFamily(id: $id){
      id,
      ${responseField}
    }
  }
`;

export const SEARCH_FAMILY = gql`
query SearchFamily($searchTerm: String){
  searchFamily(searchTerm: $searchTerm){
    id
    marriage{
      ...marriageField
    }
  }
}
${marriageFragment.marriageField}
`;

// MARRIAGE
export const ALL_MARRIAGE = gql`
query AllMarriage($id_family: ID){
  allMarriage(idFamily: $id_family){
    ...marriageField
  }
}
${marriageFragment.marriageField}
`;

export const MARRIAGE = gql`
query Marriage($id: ID){
	marriage(id: $id){
		...marriageField
	}
}
${marriageFragment.marriageField}
`;

export const SAVE_MARRIAGE = gql`
mutation SaveMarriage($data: MarriageInput){
  saveMarriage(data: $data){
    marriage{
      id
    },
    ${responseField}
  }
}
`;

export const DELETE_MARRIAGE = gql`
  mutation DeleteMarriage($id: ID!){
    deleteMarriage(id: $id){
      id,
      ${responseField}
    }
  }
`;

export const LIKE_MARRIAGE = gql`
mutation LikeMarriage($id: ID!, $email: String!){
  likeMarriage(id: $id, email: $email){
    marriage{
      likes
    }
  }
}
`;

// CHILD
export const ALL_CHILD = gql`
query AllChild($id_family: ID){
  allChild(idFamily: $id_family){
    ...childField
  }
}
${marriageFragment.childField}
`;

export const CHILD = gql`
query Child($id: ID){
	child(id: $id){
		...childField
	}
}
${marriageFragment.childField}
`;

export const SAVE_CHILD = gql`
mutation SaveChild($data: ChildInput){
  saveChild(data: $data){
    child{
      id
    },
    ${responseField}
  }
}
`;

export const DELETE_CHILD = gql`
  mutation DeleteChild($id: ID!){
    deleteChild(id: $id){
      id,
      ${responseField}
    }
  }
`;
