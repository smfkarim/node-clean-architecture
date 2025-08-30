const { UnauthorizedError } = require('../../../domain/errors/DomainErrors');

class RefreshTokenUseCase {
  constructor(userRepository, tokenService) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
  }

  async execute({ refreshToken }) {
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token is required');
    }

    try {
      const decoded = this.tokenService.verifyRefreshToken(refreshToken);
      const user = await this.userRepository.findById(decoded.id);

      if (!user || !user.hasRefreshToken(refreshToken)) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      const newAccessToken = this.tokenService.generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      const newRefreshToken = this.tokenService.generateRefreshToken({
        id: user.id,
      });

      user.removeRefreshToken(refreshToken);
      user.addRefreshToken(newRefreshToken);
      await this.userRepository.updateRefreshTokens(user.id, user.refreshTokens);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }
}

module.exports = RefreshTokenUseCase;