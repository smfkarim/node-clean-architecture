const { ConflictError, ValidationError } = require('../../../domain/errors/DomainErrors');

class RegisterUseCase {
  constructor(userRepository, hashService, tokenService) {
    this.userRepository = userRepository;
    this.hashService = hashService;
    this.tokenService = tokenService;
  }

  async execute({ email, password, name }) {
    if (!email || !password || !name) {
      throw new ValidationError('Email, password, and name are required');
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('User already exists');
    }

    const hashedPassword = await this.hashService.hash(password);
    
    const userData = {
      email,
      password: hashedPassword,
      name,
      role: 'user',
    };

    const user = await this.userRepository.create(userData);

    const accessToken = this.tokenService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = this.tokenService.generateRefreshToken({
      id: user.id,
    });

    user.addRefreshToken(refreshToken);
    await this.userRepository.updateRefreshTokens(user.id, user.refreshTokens);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }
}

module.exports = RegisterUseCase;