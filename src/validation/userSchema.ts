import Joi from '@hapi/joi';

export const userSchema = Joi.object({
  uid: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
});
