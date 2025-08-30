const UserRepository = require('../../domain/repositories/UserRepository');
const UserModel = require('../db/models/userModel');
const User = require('../../domain/entities/User');

class UserRepositoryImpl extends UserRepository {
  async create(userData) {
    const userDoc = await UserModel.create(userData);
    return this._mapToEntity(userDoc);
  }

  async findById(id) {
    const userDoc = await UserModel.findById(id);
    return userDoc ? this._mapToEntity(userDoc) : null;
  }

  async findByEmail(email) {
    const userDoc = await UserModel.findOne({ email });
    return userDoc ? this._mapToEntity(userDoc) : null;
  }

  async update(id, userData) {
    const userDoc = await UserModel.findByIdAndUpdate(
      id,
      userData,
      { new: true, runValidators: true }
    );
    return userDoc ? this._mapToEntity(userDoc) : null;
  }

  async delete(id) {
    const result = await UserModel.findByIdAndDelete(id);
    return !!result;
  }

  async updateRefreshTokens(id, refreshTokens) {
    const userDoc = await UserModel.findByIdAndUpdate(
      id,
      { refreshTokens },
      { new: true }
    );
    return userDoc ? this._mapToEntity(userDoc) : null;
  }

  _mapToEntity(userDoc) {
    return new User({
      id: userDoc._id.toString(),
      email: userDoc.email,
      password: userDoc.password,
      name: userDoc.name,
      role: userDoc.role,
      refreshTokens: userDoc.refreshTokens,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
    });
  }
}

module.exports = UserRepositoryImpl;