import Boom from '@hapi/boom';
import { Request, ResponseToolkit } from '@hapi/hapi';

const validateAuthToken = (request: Request, h: ResponseToolkit) => {
  if (request.method === 'options') {
    return h.continue; // Skip token validation for OPTIONS
  }

  const authToken = request.headers['authorization'];
  if (!authToken) {
    throw Boom.unauthorized('Missing auth token');
  }

  // TODO: Add logic to validate authToken
  return h.continue;
};

export default validateAuthToken;
