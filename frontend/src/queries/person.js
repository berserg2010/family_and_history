import { gql } from 'apollo-boost';

import {
	birthFragment,
	personFragment,
	responseField,
} from './fragments';


// PERSON
export const ALL_PERSON = gql`
query AllPerson{
  allPerson{
		...personField
  }
}
${personFragment.personField}
`;

export const PERSON = gql`
query Person($id: ID!){
  person(id: $id){
		...personField
  }
}
${personFragment.personField}
`;

export const SAVE_PERSON = gql`
mutation SavePerson($data: PersonInput){
  savePerson(data: $data){
    person{
      id
    },
    ${responseField}
  }
}
`;

export const DELETE_PERSON = gql`
  mutation DeletePerson($id: ID!){
    deletePerson(id: $id){
      id,
      ${responseField}
    }
  }
`;


export const SEARCH_PERSON = gql`
query SearchPerson($searchTerm: String){
  searchPerson(searchTerm: $searchTerm){
    id
    birth{
      ...birthField
    }
  }
}
${birthFragment.birthField}
`;

// BIRTH
export const ALL_BIRTH = gql`
query AllBirth($id_person: ID){
  allBirth(idPerson: $id_person){
    ...birthField
  }
}
${birthFragment.birthField}
`;

export const SAVE_BIRTH = gql`
mutation SaveBirth($data: BirthInput){
  saveBirth(data: $data){
    birth{
      id
    },
    ${responseField}
  }
}
`;

export const DELETE_BIRTH = gql`
  mutation DeleteBirth($id: ID!){
    deleteBirth(id: $id){
      id,
      ${responseField}
    }
  }
`;

export const LIKE_BIRTH = gql`
mutation LikeBirth($id: ID!, $email: String!){
  likeBirth(id: $id, email: $email){
    birth{
      likes
    }
  }
}
`;
