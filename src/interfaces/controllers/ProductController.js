const { NotFoundError } = require('../../domain/errors/DomainErrors');

class ProductController {
  constructor(productUseCases) {
    this.productUseCases = productUseCases;
  }

  create = async (req, res, next) => {
    try {
      const productData = {
        ...req.body,
        createdBy: req.user.id,
      };
      
      const product = await this.productUseCases.createProduct(productData);
      
      res.status(201).json({
        success: true,
        data: { product },
        message: 'Product created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const { page = 1, limit = 10, category, minPrice, maxPrice, search } = req.query;
      
      const filters = {};
      if (category) filters.category = category;
      if (minPrice || maxPrice) {
        filters.price = {};
        if (minPrice) filters.price.$gte = parseFloat(minPrice);
        if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
      }
      if (search) {
        filters.$text = { $search: search };
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: req.query.sort || '-createdAt',
      };

      const result = await this.productUseCases.getAllProducts(filters, options);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const product = await this.productUseCases.getProductById(req.params.id);
      if (!product) {
        throw new NotFoundError('Product not found');
      }
      
      res.json({
        success: true,
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const product = await this.productUseCases.updateProduct(req.params.id, req.body, req.user);
      
      res.json({
        success: true,
        data: { product },
        message: 'Product updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.productUseCases.deleteProduct(req.params.id, req.user);
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = ProductController;