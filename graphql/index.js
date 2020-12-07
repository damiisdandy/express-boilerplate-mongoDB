const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const { authentication } = require('../config');
const schemas = require('./schemas');
const resolvers = require('./resolvers');

// get User Token
const getUser = async (token) => {
  try {
    const decoded = await jwt.verify(token, authentication.jwtSecret);
    return decoded.id;
  } catch (err) {
    throw new AuthenticationError('invalid token');
  }
};

module.exports = new ApolloServer({
  typeDefs: schemas,
  resolvers,
  context: async ({ req }) => {
    const { access_token } = req.cookies;
    const user_id = await getUser(access_token);
    return { user_id };
  },
});
