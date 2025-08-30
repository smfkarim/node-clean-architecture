const express = require('express');
const { validateRegister, validateLogin, validateRefreshToken } = require('../validators/authValidator');

const createAuthRoutes = (authController, authMiddleware) => {
  const router = express.Router();

  router.post('/register', validateRegister, authController.register);
  router.post('/login', validateLogin, authController.login);
  router.post('/refresh-token', validateRefreshToken, authController.refreshToken);
  router.post('/logout', authMiddleware.authenticate, authController.logout);
  router.post('/logout-all', authMiddleware.authenticate, authController.logoutAll);
  router.get('/profile', authMiddleware.authenticate, authController.getProfile);

  return router;
};

module.exports = createAuthRoutes;