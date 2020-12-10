const sendMail = require('./mail');
const Server = require('./server');
const tokenGenerator = require('./tokenGenerator');

module.exports = {
  sendMail,
  Server,
  tokenGenerator,
};
