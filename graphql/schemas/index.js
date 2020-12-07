const { gql } = require('apollo-server-express');
const userSchema = require('./userSchema');

const linkSchema = gql`
  type Query {
    _: Boolean
  }
`;

module.exports = [linkSchema, userSchema];
