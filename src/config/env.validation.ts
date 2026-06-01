import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  PORT: Joi.number().required(),
  DATABASE_URL: Joi.string().required(),
});
