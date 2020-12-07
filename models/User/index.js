const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../../config');

const { passwordSaltRound } = config.authentication;

const UserSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    is_confirmed: {
      type: Boolean,
      default: false,
    },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, passwordSaltRound);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.validatePassword = async function (data) {
  return await bcrypt.compare(data, this.password);
};

module.exports = mongoose.model('User', UserSchema);
