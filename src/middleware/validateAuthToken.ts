import Boom from '@hapi/boom';
import { Request, ResponseToolkit } from '@hapi/hapi';

const validateAuthToken = async (request: Request, h: ResponseToolkit) => {
  // Skip auth for OPTIONS requests and public routes
  if (request.method === 'options' || request.path.startsWith('/public')) {
    return h.continue;
  }

  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw Boom.unauthorized('Invalid authorization header');
  }

  const token = authHeader.substring(7);
  try {
    // Add your token validation logic here
    // Example: const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // request.auth.credentials = decoded;
    return h.continue;
  } catch (error) {
    throw Boom.unauthorized('Invalid token');
  }
};

export default validateAuthToken;
