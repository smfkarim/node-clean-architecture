// Repositories
const UserRepositoryImpl = require('../infrastructure/repositories/UserRepositoryImpl');
const ProductRepositoryImpl = require('../infrastructure/repositories/ProductRepositoryImpl');

// Services
const TokenServiceImpl = require('../infrastructure/services/TokenServiceImpl');
const HashServiceImpl = require('../infrastructure/services/HashServiceImpl');

// Use Cases
const LoginUseCase = require('../application/use-cases/auth/LoginUseCase');
const RegisterUseCase = require('../application/use-cases/auth/RegisterUseCase');
const RefreshTokenUseCase = require('../application/use-cases/auth/RefreshTokenUseCase');
const LogoutUseCase = require('../application/use-cases/auth/LogoutUseCase');
const ProductUseCases = require('../application/use-cases/product/ProductUseCases');

// Controllers
const AuthController = require('../interfaces/controllers/AuthController');
const ProductController = require('../interfaces/controllers/ProductController');

// Middleware
const AuthMiddleware = require('../interfaces/middleware/authMiddleware');

class DIContainer {
  constructor() {
    this._container = {};
    this._setupDependencies();
  }

  _setupDependencies() {
    // Repositories
    this._container.userRepository = new UserRepositoryImpl();
    this._container.productRepository = new ProductRepositoryImpl();

    // Services
    this._container.tokenService = new TokenServiceImpl();
    this._container.hashService = new HashServiceImpl();

    // Use Cases
    this._container.loginUseCase = new LoginUseCase(
      this._container.userRepository,
      this._container.hashService,
      this._container.tokenService
    );

    this._container.registerUseCase = new RegisterUseCase(
      this._container.userRepository,
      this._container.hashService,
      this._container.tokenService
    );

    this._container.refreshTokenUseCase = new RefreshTokenUseCase(
      this._container.userRepository,
      this._container.tokenService
    );

    this._container.logoutUseCase = new LogoutUseCase(
      this._container.userRepository
    );

    this._container.productUseCases = new ProductUseCases(
      this._container.productRepository
    );

    // Controllers
    this._container.authController = new AuthController(
      this._container.loginUseCase,
      this._container.registerUseCase,
      this._container.refreshTokenUseCase,
      this._container.logoutUseCase
    );

    this._container.productController = new ProductController(
      this._container.productUseCases
    );

    // Middleware
    this._container.authMiddleware = new AuthMiddleware(
      this._container.tokenService,
      this._container.userRepository
    );
  }

  get(name) {
    if (!this._container[name]) {
      throw new Error(`Dependency ${name} not found`);
    }
    return this._container[name];
  }
}

module.exports = new DIContainer();