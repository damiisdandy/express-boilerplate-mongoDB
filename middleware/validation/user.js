const { body } = require('express-validator');

const validateUser = () => {
  return [
    body('email')
      .exists()
      .withMessage('email is required')
      .isEmail()
      .withMessage('email is invalid')
      .trim()
      .escape(),
    body('phone')
      .exists()
      .withMessage('Phone Number is required')
      .isInt()
      .withMessage('integers only!'),
    body('first_name')
      .exists()
      .withMessage('first_name is required')
      .isAlpha()
      .withMessage('alphabets only!')
      .trim()
      .escape(),
    body('last_name')
      .exists()
      .withMessage('last_name is required')
      .isAlpha()
      .withMessage('alphabets only!')
      .trim()
      .escape(),
  ];
};

const validateResetPassword = () => {
  return [
    body('password').exists().withMessage('Password is required'),
    body('token').exists().withMessage('reset Token is required'),
  ];
};

const validateChangePassword = () => {
  return [
    body('new_password').exists().withMessage('the new password is required'),
    body('old_password')
      .exists()
      .withMessage("user's current password is required"),
  ];
};

const validateRequestResetPassword = () => {
  return [
    body('email')
      .exists()
      .withMessage('specify the email')
      .isEmail()
      .withMessage('email is invalid'),
  ];
};

module.exports = {
  validateUser,
  validateResetPassword,
  validateRequestResetPassword,
  validateChangePassword,
};
