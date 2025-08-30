const Joi = require('joi');
const { ValidationError } = require('../../domain/errors/DomainErrors');

const productSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500).optional(),
  price: Joi.number().min(0).required(),
  category: Joi.string().min(2).max(50).required(),
  stock: Joi.number().integer().min(0).required(),
});

const productUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().max(500).optional(),
  price: Joi.number().min(0).optional(),
  category: Joi.string().min(2).max(50).optional(),
  stock: Joi.number().integer().min(0).optional(),
});

const validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    return next(new ValidationError(error.details[0].message));
  }
  next();
};

const validateProductUpdate = (req, res, next) => {
  const { error } = productUpdateSchema.validate(req.body);
  if (error) {
    return next(new ValidationError(error.details[0].message));
  }
  next();
};

module.exports = {
  validateProduct,
  validateProductUpdate,
};