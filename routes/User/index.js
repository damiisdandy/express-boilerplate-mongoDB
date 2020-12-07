const express = require('express');
const { userValidation } = require('../../middleware/validation');
const middleware = require('../../middleware/User');
const authMiddleware = require('../../middleware/Auth');
const controller = require('../../controllers/User');

const router = express.Router();

router.post(
  '/signup',
  userValidation.validateUser(),
  middleware.verifyCreateUser,
  controller.createUser
);

router.put(
  '/update',
  authMiddleware.isAuthenticated,
  userValidation.validateUser(),
  middleware.verifyUpdateUser,
  controller.updateUser
);

router.post(
  '/request-reset-password',
  userValidation.validateRequestResetPassword(),
  controller.requestResetPassword
);

router.post(
  '/confirm-reset-password',
  middleware.verifyResetToken,
  controller.confirmResetPassword
);

router.post(
  '/reset-password',
  userValidation.validateResetPassword(),
  middleware.verifyResetToken,
  controller.resetPassword
);

router.post(
  '/change-password',
  authMiddleware.isAuthenticated,
  userValidation.validateChangePassword(),
  middleware.verifyChangePassword,
  controller.changePassword
);

router.get(
  '/send-confirm-email',
  authMiddleware.isAuthenticated,
  controller.sendConfirmationEmail
);

router.post('/confirm-email', controller.confirmEmail);

module.exports = router;
