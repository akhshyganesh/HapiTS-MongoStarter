import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import Joi from '@hapi/joi';

export const validatePayload = (schema: Joi.ObjectSchema) => {
  return {
    validate: {
      payload: schema,
      failAction: (
        request: Request,
        h: ResponseToolkit,
        err?: Error,
      ): ResponseObject => {
        throw err || new Error('Invalid request payload');
      },
    },
  };
};

export default validatePayload;
