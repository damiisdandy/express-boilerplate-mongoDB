const { validationResult } = require('express-validator');
const { authentication } = require('../../config');
const User = require('../../models/User');
const Token = require('../../models/User/token');
const { Server } = require('../../utils');

const verifyCreateUser = async (req, res, next) => {
  const { email, phone, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: errors.array(),
    });
  }
  try {
    const userEmailTest = await User.findOne({ email });
    if (userEmailTest) {
      return res.status(400).json({
        status: false,
        message: 'Email Provided Already Exists',
      });
    }
    const userPhoneTest = await User.findOne({ phone });
    if (userPhoneTest) {
      return res.status(400).json({
        status: false,
        message: 'Phone Provided Already Exists',
      });
    }
    const passwordIsNotValid = authentication.passwordSchema.validate(
      password,
      {
        list: true,
      }
    );
    if (passwordIsNotValid.length !== 0) {
      return res.status(422).json({
        status: false,
        message: passwordIsNotValid,
      });
    }

    next();
  } catch (err) {
    Server.serverError(res, err);
  }
};

const verifyUpdateUser = async (req, res, next) => {
  const errors = validationResult(req);
  const { email, phone } = req.body;
  const { user_id } = req;
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: errors.array(),
    });
  }
  try {
    const userEmailTest = await User.findOne({ email });
    if (userEmailTest && userEmailTest._id.toString() !== user_id) {
      return res.status(400).json({
        status: false,
        message: 'Email Provided Already Exists',
      });
    }
    const userPhoneTest = await User.findOne({ phone });
    if (userPhoneTest && userPhoneTest._id.toString() !== user_id) {
      return res.status(400).json({
        status: false,
        message: 'Phone Provided Already Exists',
      });
    }

    next();
  } catch (err) {
    Server.serverError(res, err);
  }
};

const verifyResetToken = async (req, res, next) => {
  const { token } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: errors.array(),
    });
  }
  if (!token) {
    return res.status(422).json({
      status: false,
      message: 'token is required',
    });
  }
  const valid_token = token.replace(/myslash/g, '/');
  try {
    const findToken = await Token.findOne({
      token: valid_token,
      type: 'reset-password',
    });
    if (!findToken) {
      return res.status(403).json({
        status: false,
        message: 'Token Invalid',
      });
    }

    if (new Date() > findToken.expires) {
      return res.status(403).json({
        status: false,
        message: 'Token Expired',
      });
    }

    req.body.token = findToken;
    next();
  } catch (err) {
    Server.serverError(res, err);
  }
};

const verifyChangePassword = async (req, res, next) => {
  const { old_password, new_password } = req.body;
  const { user_id } = req;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: errors.array(),
    });
  }

  try {
    const user = await User.findById(user_id);
    const isValid = await user.validatePassword(old_password);
    if (!isValid) {
      return res.status(401).send({
        status: false,
        message: 'incorrect password',
        data: {
          user: null,
        },
      });
    }
    const passwordIsNotValid = authentication.passwordSchema.validate(
      new_password,
      {
        list: true,
      }
    );
    if (passwordIsNotValid.length !== 0) {
      return res.status(422).json({
        status: false,
        message: passwordIsNotValid,
      });
    }

    next();
  } catch (err) {
    Server.serverError(res, err);
  }
};

module.exports = {
  verifyCreateUser,
  verifyUpdateUser,
  verifyResetToken,
  verifyChangePassword,
};
