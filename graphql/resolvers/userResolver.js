const User = require('../../models/User');

module.exports = {
  Query: {
    user: async (_, __, { user_id }) => {
      return await User.findById({ _id: user_id }).populate('roles');
    },
  },
};
