const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const config = require('../../config');
const { sendMail, Server, tokenGenerator } = require('../../utils');

const User = require('../../models/User');
const Role = require('../../models/User/role');
const Token = require('../../models/User/token');

const { token_expiry_time, jwtSecret, passwordSchema } = config.authentication;

const createUser = async (req, res) => {
  const { email } = req.body;
  try {
    const role = await Role.findOne({ name: 'is_user' });
    const user = await User.create({
      ...req.body,
      roles: [role._id],
    });
    // Email Confirmation
    const token = await tokenGenerator(user._id.toString());
    await Token.create({
      token,
      type: 'account/account-email-confirmation',
      user_id: user._id,
    });
    const mailStatus = await sendMail({
      to: email,
      type: 'account/email-confirmation',
      parameters: {
        link: `${process.env.FRONTEND_URL}/auth/confirm-user/${token}`,
        name: `${user.first_name}`,
        email,
      },
      subject: 'Jetron Email Confirmation',
    });

    const access_token = jwt.sign({ id: user._id }, jwtSecret, {
      expiresIn: token_expiry_time,
    });
    // const refresh_token = jwt.sign({ id: user._id }, jwtRefreshSecret, {
    //   expiresIn: refresh_token_expiry_time,
    // });
    res.cookie('access_token', access_token, config.cookie);
    // res.cookie('refresh_token', refresh_token, config.cookie);

    return res.status(201).json({
      status: true,
      data: {
        user_id: user._id,
        mail_status: mailStatus,
      },
    });
  } catch (err) {
    Server.serverError(res, err);
  }
};

const updateUser = async (req, res) => {
  const { user_id } = req;
  const { email, password } = req.body;

  if (password) delete req.body.password;

  try {
    const user = await User.findOne({ _id: user_id });
    let mailStatus = '';
    if (user.email !== email) {
      const token = await tokenGenerator(user._id.toString());
      await Token.create({
        token,
        type: 'account-email-confirmation',
        user_id,
      });
      mailStatus = await sendMail({
        to: email,
        type: 'account/email-confirmation',
        parameters: {
          link: `${process.env.FRONTEND_URL}/auth/confirm-user/${token}`,
          name: `${user.first_name}`,
          email,
        },
        subject: 'Jetron Email Confirmation',
      });
      req.body.is_confirmed = false;
    }
    await User.findByIdAndUpdate({ _id: user_id }, req.body);
    return res.status(200).json({
      status: true,
      data: {
        user_id,
        mail_status: mailStatus,
      },
    });
  } catch (err) {
    Server.serverError(res, err);
  }
};

const requestResetPassword = async (req, res) => {
  const { email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: errors.array(),
    });
  }
  try {
    const user = await User.findOne({
      email,
    });
    await Token.deleteMany({
      user_id: user._id,
      type: 'reset-password',
    });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'user does not exist',
      });
    }
    const token = await tokenGenerator(user._id.toString());
    const date = new Date();
    await Token.create({
      token,
      type: 'reset-password',
      expires: new Date(date.getTime() + 10 * 60000), // unaware of duration
      user_id: user._id,
    });
    const mailStatus = await sendMail({
      to: email,
      type: 'account/password-reset',
      parameters: {
        link: `${process.env.FRONTEND_URL}/password-reset/${token.replace(
          /\//g,
          'myslash'
        )}`,
        name: `${user.first_name}`,
        email: `${user.email}`,
      },
      subject: 'Jetron Password reset',
    });

    return res.status(200).json({
      status: true,
      mail_status: mailStatus,
    });
  } catch (err) {
    Server.serverError(res, err);
  }
};

const confirmResetPassword = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ _id: token.user_id });
    return res.status(200).json({
      status: true,
      data: {
        user: {
          user_id: user.id,
          first_name: user.first_name,
        },
      },
    });
  } catch (err) {
    Server.serverError(res, err);
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  const passwordIsNotValid = passwordSchema.validate(password, {
    list: true,
  });
  if (passwordIsNotValid.length !== 0) {
    return res.status(422).json({
      status: false,
      message: passwordIsNotValid,
    });
  }
  try {
    const user = await User.findById(token.user_id);
    const samePassword = await user.validatePassword(password);
    if (!samePassword) {
      user.password = password;
      await user.save();
    }

    await Token.deleteOne({ _id: token._id });
    return res.status(200).json({
      status: true,
      data: {
        message: 'Successfully set Password, proceed to login',
      },
    });
  } catch (err) {
    Server.serverError(res, err);
  }
};

const changePassword = async (req, res) => {
  const { new_password } = req.body;
  const { user_id } = req;

  try {
    const user = await User.findById(user_id);
    const samePassword = await user.validatePassword(new_password);
    if (!samePassword) {
      user.password = new_password;
      await user.save();
    }

    return res.status(200).json({
      status: true,
      data: {
        message: 'Successfully changed password',
      },
    });
  } catch (err) {
    Server.serverError(res, err);
  }
};

const sendConfirmationEmail = async (req, res) => {
  const { user_id } = req;

  try {
    await Token.deleteMany({
      user_id,
      type: 'account-email-confirmation',
    });

    const user = await User.findById(user_id);
    const date = new Date();

    let token = await tokenGenerator(user_id);
    await Token.create({
      expires: new Date(date.getTime() + 100 * 60000), // unaware of duration
      user_id: user._id,
      token,
      type: 'account-email-confirmation',
    });

    token = token.replace(/\//g, 'myslash');
    const mailStatus = await sendMail({
      to: user.email,
      type: 'account/email-confirmation',
      parameters: {
        link: `${process.env.FRONTEND_URL}/account/confirm-email/${token}`,
        name: `${user.first_name}`,
        email: user.email,
      },
      subject: 'Jetron Email Confirmation',
    });

    return res.status(200).json({
      status: true,
      mail_status: mailStatus,
    });
  } catch (err) {
    Server.serverError(res, err);
  }
};

const confirmEmail = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({
      status: false,
      message: 'token not provided',
    });
  }

  try {
    const findToken = await Token.findOne({
      token: token.replace(/myslash/g, '/'),
      type: 'account-email-confirmation',
    });

    if (!findToken) {
      return res.status(403).json({
        status: false,
        message: 'token is invalid',
      });
    }
    const date = new Date();
    if (findToken.expires < date.getTime()) {
      return res.status(403).json({
        status: false,
        message: 'token expired',
      });
    }

    await User.updateOne({ _id: findToken.user_id }, { is_confirmed: true });
    await Token.deleteOne({ _id: findToken._id });

    return res.status(200).json({
      status: true,
      message: 'user email confirmed',
    });
  } catch (err) {
    Server.serverError(res, err);
  }
};

module.exports = {
  createUser,
  updateUser,
  sendConfirmationEmail,
  confirmEmail,
  //****PASSWORD RESET****//
  requestResetPassword,
  confirmResetPassword,
  resetPassword,
  changePassword,
};
