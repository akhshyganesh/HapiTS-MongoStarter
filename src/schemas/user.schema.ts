import Joi from 'joi';

export const createUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'string.empty': 'Password is required',
    'any.required': 'Password is required',
  }),
  firstName: Joi.string().required().messages({
    'string.empty': 'First name is required',
    'any.required': 'First name is required',
  }),
  lastName: Joi.string().required().messages({
    'string.empty': 'Last name is required',
    'any.required': 'Last name is required',
  }),
  role: Joi.string().valid('user', 'admin').default('user'),
  isActive: Joi.boolean().default(true),
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email().messages({
    'string.email': 'Email must be a valid email address',
  }),
  firstName: Joi.string(),
  lastName: Joi.string(),
  role: Joi.string().valid('user', 'admin'),
  isActive: Joi.boolean(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
    'any.required': 'Password is required',
  }),
});
