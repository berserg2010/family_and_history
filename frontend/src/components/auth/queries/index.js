import { gql } from "apollo-boost";


export const TOKEN_AUTH = gql`
  mutation TokenAuth(
    $email: String!,
    $password: String!
  ){
    tokenAuth(
      email: $email,
      password: $password
    ){
      token
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation signupUser(
    $email: String!,
    $password: String!
  ){
    signupUser(
      email: $email,
      password: $password
    ){
      email
    },
    tokenAuth(
      email: $email,
      password: $password
    ){
      token
    }    
  }
`;
