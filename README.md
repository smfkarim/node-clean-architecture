# Node.js Clean Architecture with JWT Authentication
A production-ready Node.js application built with Clean Architecture principles, featuring JWT authentication with access/refresh tokens, comprehensive security, and CRUD operations.

## 🚀 Features

- **Clean Architecture** with proper separation of concerns
- **JWT Authentication** with access and refresh tokens
- **Role-based Authorization** (user/admin)
- **Secure Token Storage** with HTTP-only cookies
- **Rate Limiting** and security middleware
- **Input Validation** with Joi
- **Comprehensive Error Handling**
- **Unit and Integration Testing**
- **Production-ready** configuration

## 📦 Installation

1. **Clone and setup:**
```bash
git clone <your-repo>
cd node-clean-architecture-jwt
npm install

Domain Layer (Core Business Rules)
├── Entities (User, Product)
├── Repository Interfaces
└── Domain Errors

Application Layer (Use Cases)
├── Authentication Use Cases
├── Product Use Cases
└── Service Interfaces

Infrastructure Layer (External Concerns)
├── Database Models
├── Repository Implementations
└── Service Implementations

Interface Layer (Controllers & Routes)
├── HTTP Controllers
├── Route Definitions
├── Middleware
└── Validators

🔒 Security Features

JWT Tokens: Separate access (15min) and refresh (7d) tokens
Password Hashing: bcrypt with configurable salt rounds
Rate Limiting: Different limits for auth vs general endpoints
Security Headers: Helmet.js for secure headers
CORS: Configurable cross-origin resource sharing
Input Validation: Joi schemas for request validation
Error Handling: No sensitive data leakage

🚀 Production Deployment

Environment Variables:

Set strong JWT secrets
Configure MongoDB URI
Set NODE_ENV=production


Security Checklist:

Use HTTPS in production
Set secure cookie flags
Configure proper CORS origins
Use environment-specific rate limits


Monitoring:

Add application performance monitoring
Set up log aggregation
Configure health checks

📁 Project Structure
src/
├── domain/           # Business logic and rules
├── application/      # Use cases and application services
├── infrastructure/   # External frameworks and tools
├── interfaces/       # Controllers, routes, middleware
├── config/          # Configuration files
└── di/              # Dependency injection


🛠️ Development
bash# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Format code
npm run format

# Run tests
npm test

📚 API Documentation
Authentication Endpoints
Register User
httpPOST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
Login User
httpPOST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
Refresh Token
httpPOST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
Get Profile
httpGET /api/auth/profile
Authorization: Bearer <access-token>
Logout
httpPOST /api/auth/logout
Authorization: Bearer <access-token>

Product Endpoints
Get All Products
httpGET /api/products?page=1&limit=10&category=Electronics&search=phone

Get Product by ID
httpGET /api/products/:id

Create Product
httpPOST /api/products
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "name": "iPhone 15",
  "description": "Latest iPhone model",
  "price": 999.99,
  "category": "Electronics",
  "stock": 50
}
Update Product
httpPUT /api/products/:id
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "name": "iPhone 15 Pro",
  "price": 1099.99
}
Delete Product
httpDELETE /api/products/:id
Authorization: Bearer <access-token>