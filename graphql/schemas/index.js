const { gql } = require('apollo-server-express');

const linkSchema = gql`
  type Query {
    _: Boolean
  }
`;

module.exports = [linkSchema];
