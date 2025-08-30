const jwt = require('jsonwebtoken');
const config = require('../../config/environment');
const TokenService = require('../../application/services/TokenService');

class TokenServiceImpl extends TokenService {
  generateAccessToken(payload) {
    return jwt.sign(payload, config.jwt.accessTokenSecret, {
      expiresIn: config.jwt.accessTokenExpiry,
    });
  }

  generateRefreshToken(payload) {
    return jwt.sign(payload, config.jwt.refreshTokenSecret, {
      expiresIn: config.jwt.refreshTokenExpiry,
    });
  }

  verifyAccessToken(token) {
    return jwt.verify(token, config.jwt.accessTokenSecret);
  }

  verifyRefreshToken(token) {
    return jwt.verify(token, config.jwt.refreshTokenSecret);
  }
}

module.exports = TokenServiceImpl;