const express = require('express');
const { validateProduct, validateProductUpdate } = require('../validators/productValidator');

const createProductRoutes = (productController, authMiddleware) => {
  const router = express.Router();

  // Public routes
  router.get('/', productController.getAll);
  router.get('/:id', productController.getById);

  // Protected routes
  router.use(authMiddleware.authenticate);
  router.post('/', validateProduct, productController.create);
  router.put('/:id', validateProductUpdate, productController.update);
  router.delete('/:id', productController.delete);

  return router;
};

module.exports = createProductRoutes;