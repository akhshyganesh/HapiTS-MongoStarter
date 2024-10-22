import { Request, ResponseToolkit } from '@hapi/hapi';

const validateAuthToken = (request: Request, h: ResponseToolkit) => {
  const authToken = request.headers['authorization'];
  if (!authToken) {
    return h.response({ error: 'Missing auth token' }).code(401).takeover();
  }
  // TODO: Add logics to validate authToken
  return h.continue;
};

export default validateAuthToken;
