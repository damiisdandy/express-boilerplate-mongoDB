/* eslint-disable no-console */
const mongoose = require('mongoose');
const Role = require('../models/User/role');
const config = require('./index');

const { ROLES } = config.db;

mongoose.Promise = global.Promise;

module.exports = () => {
  const setInitialRoles = async () => {
    //This function initializes the roles available if there is no document in roles collection
    try {
      const count = await Role.estimatedDocumentCount();
      if (count === 0) {
        ROLES.forEach(async (role) => {
          await Role.create({ name: role });
          console.log(
            `\n role \u001b[1m\u001b[33m${role}\u001b[0m successfully created ⚡`
          );
        });
      }
    } catch (err) {
      console.error(err.toString());
    }
  };

  mongoose
    .connect(config.db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log('\n Successfully connected to MongoDB ✅');
      setInitialRoles();
    })
    .catch((err) => {
      console.error('\n Connection error ❌', err);
      process.exit();
    });
};
