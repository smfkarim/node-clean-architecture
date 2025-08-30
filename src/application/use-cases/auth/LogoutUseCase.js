const { UnauthorizedError } = require('../../../domain/errors/DomainErrors');

class LogoutUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ refreshToken, userId }) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    if (refreshToken) {
      user.removeRefreshToken(refreshToken);
    } else {
      user.clearRefreshTokens();
    }

    await this.userRepository.updateRefreshTokens(user.id, user.refreshTokens);
    
    return { message: 'Logged out successfully' };
  }
}

module.exports = LogoutUseCase;