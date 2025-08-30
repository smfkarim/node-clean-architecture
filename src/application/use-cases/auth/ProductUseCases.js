const { NotFoundError, ForbiddenError, ValidationError } = require('../../../domain/errors/DomainErrors');

class ProductUseCases {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async createProduct(data) {
    this._validateProductData(data);
    return await this.productRepository.create(data);
  }

  async getAllProducts(filters = {}, options = {}) {
    return await this.productRepository.findAll(filters, options);
  }

  async getProductById(id) {
    if (!id) {
      throw new ValidationError('Product ID is required');
    }
    return await this.productRepository.findById(id);
  }

  async updateProduct(id, data, user) {
    if (!id) {
      throw new ValidationError('Product ID is required');
    }

    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundError('Product not found');
    }

    if (user.role !== 'admin' && existingProduct.createdBy !== user.id) {
      throw new ForbiddenError('You can only update your own products');
    }

    if (data.price !== undefined && data.price < 0) {
      throw new ValidationError('Price cannot be negative');
    }

    if (data.stock !== undefined && data.stock < 0) {
      throw new ValidationError('Stock cannot be negative');
    }

    return await this.productRepository.update(id, data);
  }

  async deleteProduct(id, user) {
    if (!id) {
      throw new ValidationError('Product ID is required');
    }

    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundError('Product not found');
    }

    if (user.role !== 'admin' && existingProduct.createdBy !== user.id) {
      throw new ForbiddenError('You can only delete your own products');
    }

    return await this.productRepository.delete(id);
  }

  _validateProductData(data) {
    if (!data.name || !data.price || !data.category || data.stock === undefined) {
      throw new ValidationError('Name, price, category, and stock are required');
    }

    if (data.price < 0) {
      throw new ValidationError('Price cannot be negative');
    }

    if (data.stock < 0) {
      throw new ValidationError('Stock cannot be negative');
    }
  }
}

module.exports = ProductUseCases;