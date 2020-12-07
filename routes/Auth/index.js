const express = require('express');
const middleware = require('../../middleware/Auth');
const controller = require('../../controllers/Auth');

const router = express.Router();

router.post('/signin', middleware.verifySignIn, controller.signIn);
router.post('/signout', controller.signOut);
router.post('/status', controller.status);

router.post(
  '/set-role',
  middleware.isAuthenticated,
  middleware.isAdmin,
  middleware.validateRole,
  controller.setRole
);

module.exports = router;
