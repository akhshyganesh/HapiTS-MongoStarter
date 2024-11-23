import { ServerRoute } from '@hapi/hapi';
import UserController from '@/controllers/user.controller';
import { validatePayload } from '@/middleware/validation';
import { userSchema } from '@/validation/userSchema';

const userRoutes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/users',
    options: validatePayload(userSchema),
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
    options: validatePayload(userSchema),
    handler: UserController.updateUser,
  },
  {
    method: 'DELETE',
    path: '/users/{id}',
    handler: UserController.deleteUser,
  },
];

export default userRoutes;
