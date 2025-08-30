const ProductRepository = require('../../domain/repositories/ProductRepository');
const ProductModel = require('../db/models/productModel');
const Product = require('../../domain/entities/Product');

class ProductRepositoryImpl extends ProductRepository {
  async create(data) {
    const productDoc = await ProductModel.create(data);
    await productDoc.populate('createdBy', 'name email');
    return this._mapToEntity(productDoc);
  }

  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 10, sort = '-createdAt' } = options;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      ProductModel.find(filters)
        .populate('createdBy', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      ProductModel.countDocuments(filters),
    ]);

    return {
      products: products.map(doc => this._mapToEntity(doc)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id) {
    const productDoc = await ProductModel.findById(id).populate('createdBy', 'name email');
    return productDoc ? this._mapToEntity(productDoc) : null;
  }

  async update(id, data) {
    const productDoc = await ProductModel.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');
    
    return productDoc ? this._mapToEntity(productDoc) : null;
  }

  async delete(id) {
    const result = await ProductModel.findByIdAndDelete(id);
    return !!result;
  }

  async findByCategory(category, options = {}) {
    return this.findAll({ category }, options);
  }

  async search(searchTerm, options = {}) {
    const filters = {
      $text: { $search: searchTerm },
    };
    return this.findAll(filters, options);
  }

  _mapToEntity(productDoc) {
    return new Product({
      id: productDoc._id.toString(),
      name: productDoc.name,
      description: productDoc.description,
      price: productDoc.price,
      category: productDoc.category,
      stock: productDoc.stock,
      createdBy: productDoc.createdBy._id.toString(),
      createdAt: productDoc.createdAt,
      updatedAt: productDoc.updatedAt,
    });
  }
}

module.exports = ProductRepositoryImpl;