const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    first_name: String
    last_name: String
    phone: String
    email: String
    is_confirmed: Boolean
    roles: [Role!]!
  }
  type Role {
    id: ID!
    name: String
  }
  extend type Query {
    user: User
  }
`;
