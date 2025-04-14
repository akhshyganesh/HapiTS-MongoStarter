import { ServerRoute } from '@hapi/hapi';
import { UserController } from '@/controllers/user.controller';
import Boom from '@hapi/boom';
import { Request, ResponseToolkit } from '@hapi/hapi';

const checkAdminAccess = (request: Request, h: ResponseToolkit): IAny => {
  const user = request.auth.credentials;

  if (!user || user.role !== 'admin') {
    throw Boom.forbidden('Access denied');
  }

  return h.continue;
};

const userController = new UserController();

export const userRoutes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/api/users',
    options: {
      auth: 'jwt',
      pre: [{ method: checkAdminAccess }],
      description: 'Create a new user',
      tags: ['api', 'users'],
      handler: userController.createUser,
    },
  },
  {
    method: 'GET',
    path: '/api/users',
    options: {
      auth: 'jwt',
      pre: [{ method: checkAdminAccess }],
      description: 'Get all users',
      tags: ['api', 'users'],
      handler: userController.getUsers,
    },
  },
  {
    method: 'GET',
    path: '/api/users/{id}',
    options: {
      auth: 'jwt',
      description: 'Get user by ID',
      tags: ['api', 'users'],
      handler: userController.getUserById,
    },
  },
  {
    method: 'PUT',
    path: '/api/users/{id}',
    options: {
      auth: 'jwt',
      pre: [{ method: checkAdminAccess }],
      description: 'Update user',
      tags: ['api', 'users'],
      handler: userController.updateUser,
    },
  },
  {
    method: 'DELETE',
    path: '/api/users/{id}',
    options: {
      auth: 'jwt',
      pre: [{ method: checkAdminAccess }],
      description: 'Delete user',
      tags: ['api', 'users'],
      handler: userController.deleteUser,
    },
  },
];
