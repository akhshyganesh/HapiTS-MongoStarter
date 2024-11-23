import Boom from '@hapi/boom';
import { Request, ResponseToolkit } from '@hapi/hapi';
import UserService from '@/services/user.service';
import { IUser } from '@/models/user.model';

class UserController {
  async createUser(request: Request, h: ResponseToolkit) {
    try {
      const user = await UserService.createUser(request.payload as IUser);
      return h.response(user).code(201);
    } catch (error: any) {
      return Boom.badRequest(error.message);
    }
  }

  async getUsers(request: Request, h: ResponseToolkit) {
    try {
      const users = await UserService.getUsers();
      return h.response(users).code(200);
    } catch (error: any) {
      return Boom.badRequest(error.message);
    }
  }

  async getUserById(request: Request, h: ResponseToolkit) {
    try {
      const user = await UserService.getUserById(request.params.id);
      if (!user) {
        return Boom.notFound('User not found');
      }
      return h.response(user).code(200);
    } catch (error: any) {
      return Boom.badRequest(error.message);
    }
  }

  async updateUser(request: Request, h: ResponseToolkit) {
    try {
      const user = await UserService.updateUser(
        request.params.id,
        request.payload as Partial<IUser>,
      );
      if (!user) {
        return Boom.notFound('User not found');
      }
      return h.response(user).code(200);
    } catch (error: any) {
      return Boom.badRequest(error.message);
    }
  }

  async deleteUser(request: Request, h: ResponseToolkit) {
    try {
      const user = await UserService.deleteUser(request.params.id);
      if (!user) {
        return Boom.notFound('User not found');
      }
      return h.response('User deleted successfully').code(200);
    } catch (error: any) {
      return Boom.badRequest(error.message);
    }
  }
}

export default new UserController();
