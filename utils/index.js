const sendMail = require('./mail');
const Server = require('./server');
const axios = require('./axios');
const paystack = require('./paystack');
const tokenGenerator = require('./tokenGenerator');

module.exports = {
  sendMail,
  Server,
  axios,
  paystack,
  tokenGenerator,
};
