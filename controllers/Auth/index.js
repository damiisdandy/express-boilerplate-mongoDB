const jwt = require('jsonwebtoken');
const config = require('../../config');
const { Server } = require('../../utils');
const { authentication } = require('../../config');
const User = require('../../models/User');
const Role = require('../../models/User/role');

const { token_expiry_time, jwtSecret } = config.authentication;

const signIn = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    const access_token = jwt.sign({ id: user._id }, jwtSecret, {
      expiresIn: token_expiry_time,
    });
    res.cookie('access_token', access_token, config.cookie);
    return res.status(200).json({
      status: true,
      data: {
        user: {
          id: user._id,
        },
      },
    });
  } catch (err) {
    Server.serverError(res, err);
  }
};

const status = async (req, res) => {
  const { access_token } = req.cookies;
  try {
    await jwt.verify(access_token, authentication.jwtSecret);
    return res.status(200).json({
      status: true,
      message: 'user is still authenticated',
    });
  } catch (err) {
    Server.serverError(res, err);
  }
};

const signOut = (req, res) => {
  res.clearCookie('access_token', config.cookie);
  // res.clearCookie('refresh_token');
  return res.status(200).json({
    status: true,
    message: 'successfully logged out',
  });
};

const setRole = async (req, res) => {
  const { user_id, role, action } = req.body;
  try {
    // convert role to id
    const roleObj = await Role.findOne({ name: role });
    // get user
    const instance = await User.findById(user_id);
    // get user's role
    let { roles } = instance;
    if (action === 'add') {
      roles.push(roleObj);
    } else {
      roles = roles.filter((el) => el.toString() !== roleObj._id.toString());
    }
    instance.roles = roles;
    const user = await instance.save();
    return res.status(200).json({
      status: true,
      data: {
        roles: user.roles,
      },
    });
  } catch (err) {
    Server.serverError(res, err);
  }
};

module.exports = {
  signIn,
  status,
  setRole,
  signOut,
};
