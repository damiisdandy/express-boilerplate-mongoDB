const bcrypt = require('bcryptjs');

module.exports = async (id) => {
  return await bcrypt.hash(id.toString(), 9);
  // const token = await crypto.randomBytes(crypto_length).toString('hex');
};
