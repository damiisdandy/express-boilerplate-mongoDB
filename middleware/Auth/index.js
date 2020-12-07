const jwt = require('jsonwebtoken');
const { authentication } = require('../../config');
const User = require('../../models/User');
const Role = require('../../models/User/role');
const { Server } = require('../../utils');

const { jwtSecret } = authentication;

const verifySignIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'user not found',
      });
    }
    const isValid = await user.validatePassword(password);
    if (!isValid) {
      return res.status(401).send({
        message: 'incorrect password',
        data: {
          user: null,
        },
      });
    }
    next();
  } catch (err) {
    Server.serverError(res, err);
  }
};

const validateRole = async (req, res, next) => {
  const { user_id, role, action } = req.body;
  // check if user_id is in req.body
  if (!user_id) {
    return res.status(422).json({
      status: false,
      message: 'user_id is required',
    });
  }
  // check if action is in req.body
  if (!action) {
    return res.status(422).json({
      status: false,
      message: 'action is required',
    });
  }
  // check if action is either 'add' or 'remove'
  if (action !== 'add' && action !== 'remove') {
    return res.status(422).json({
      status: false,
      message: 'action specified is invalid (either `add` or `remove`)',
    });
  }
  // check if role is in req.body
  if (!role) {
    return res.status(422).json({
      status: false,
      message: 'role is required',
    });
  }
  try {
    // check if role exists
    const exists = await Role.exists({ name: role });
    if (!exists) {
      return res.status(422).json({
        status: false,
        message: 'role is invalid',
      });
    }
    // get user
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'user does not exist',
      });
    }
    // get all roles related to user's roles
    const roles = await Role.find({ _id: { $in: user.roles } });
    // check if role given is already associated with user
    const hasRole = roles.find((el) => el.name === role);
    if (hasRole && action === 'add') {
      return res.status(400).json({
        status: false,
        message: 'user already has provided role',
      });
    }
    if (!hasRole && action === 'remove') {
      return res.status(400).json({
        status: false,
        message: `user never had ${role} role`,
      });
    }

    next();
  } catch (err) {
    Server.serverError(res, err);
  }
};

// Authorization
const isAdmin = async (req, res, next) => {
  const { user_id } = req;
  try {
    const user = await User.findById(user_id);
    const roles = await Role.find({ _id: { $in: user.roles } });
    const isAdministrator = roles.find((el) => el.name === 'is_admin');
    if (!isAdministrator) {
      return res.status(401).json({
        status: false,
        message: 'Require Admin Role!',
      });
    }
    next();
  } catch (err) {
    Server.serverError(res, err);
  }
};

const isAuthenticated = (req, res, next) => {
  try {
    const { access_token } = req.cookies;
    jwt.verify(access_token, jwtSecret, (err, decoded) => {
      if (err) {
        res.clearCookie('access_token');
        // res.clearCookie('refresh_token');
        return res.status(401).json({
          status: false,
          message: 'Token provided is invalid',
        });
      }
      req.user_id = decoded.id;
      next();
    });
    // TODO: Check if user ID is in collection
  } catch (err) {
    return res.status(422).json({
      status: false,
      message: 'No token provided',
    });
  }
};

module.exports = {
  isAuthenticated,
  verifySignIn,
  validateRole,
  isAdmin,
};
