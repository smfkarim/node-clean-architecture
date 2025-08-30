const { UnauthorizedError, ForbiddenError } = require('../../domain/errors/DomainErrors');

class AuthMiddleware {
  constructor(tokenService, userRepository) {
    this.tokenService = tokenService;
    this.userRepository = userRepository;
  }

  authenticate = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Access token required');
      }

      const token = authHeader.substring(7);
      const decoded = this.tokenService.verifyAccessToken(token);
      
      const user = await this.userRepository.findById(decoded.id);
      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {
      next(new UnauthorizedError('Invalid or expired token'));
    }
  };

  authorize = (roles = []) => {
    return (req, res, next) => {
      if (!req.user) {
        return next(new UnauthorizedError('Authentication required'));
      }

      if (roles.length && !roles.includes(req.user.role)) {
        return next(new ForbiddenError('Insufficient permissions'));
      }

      next();
    };
  };
}

module.exports = AuthMiddleware;