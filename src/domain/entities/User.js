class User {
  constructor({ id, email, password, name, role = 'user', refreshTokens = [], createdAt, updatedAt }) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.role = role;
    this.refreshTokens = refreshTokens;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isAdmin() {
    return this.role === 'admin';
  }

  hasRefreshToken(token) {
    return this.refreshTokens.includes(token);
  }

  addRefreshToken(token) {
    this.refreshTokens.push(token);
  }

  removeRefreshToken(token) {
    this.refreshTokens = this.refreshTokens.filter(t => t !== token);
  }

  clearRefreshTokens() {
    this.refreshTokens = [];
  }
}

module.exports = User;