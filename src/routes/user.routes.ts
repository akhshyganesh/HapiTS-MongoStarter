import { ServerRoute } from '@hapi/hapi';
import UserController from '@/controller/user.controller';

const userRoutes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/users',
    handler: UserController.createUser,
  },
  {
    method: 'GET',
    path: '/users',
    handler: UserController.getUsers,
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: UserController.getUserById,
  },
  {
    method: 'PUT',
    path: '/users/{id}',
    handler: UserController.updateUser,
  },
  {
    method: 'DELETE',
    path: '/users/{id}',
    handler: UserController.deleteUser,
  },
];

export default userRoutes;
