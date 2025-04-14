import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import Boom from '@hapi/boom';
import { UserService } from '@/services/user.service';
import ResponseFormatter from '@/utils/response/formatter';
import { createUserSchema, updateUserSchema } from '@/schemas/user.schema';
import { DUPLICATE_ENTRY_CODE } from '@/constant';

export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public createUser = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    try {
      const userData = await createUserSchema.validateAsync(request.payload);
      const user = await this.userService.createUser(userData);

      return h.response(ResponseFormatter.success(user)).code(201);
    } catch (error: IAny) {
      if (error.code === DUPLICATE_ENTRY_CODE) {
        throw Boom.conflict('Email already in use');
      }
      if (error.isJoi) {
        throw Boom.badRequest(error.message);
      }
      throw Boom.badImplementation('Failed to create user');
    }
  };

  public getUsers = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    try {
      const users = await this.userService.getUsers();
      return h.response(ResponseFormatter.success(users));
    } catch (error: IAny) {
      throw Boom.badImplementation('Failed to retrieve users');
    }
  };

  public getUserById = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    try {
      const { id } = request.params;
      const user = await this.userService.getUserById(id);

      if (!user) {
        throw Boom.notFound('User not found');
      }

      return h.response(ResponseFormatter.success(user));
    } catch (error: IAny) {
      if (Boom.isBoom(error)) {
        throw error;
      }
      throw Boom.badImplementation('Failed to retrieve user');
    }
  };

  public updateUser = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    try {
      const { id } = request.params;
      const updateData = await updateUserSchema.validateAsync(request.payload);

      const updatedUser = await this.userService.updateUser(id, updateData);

      if (!updatedUser) {
        throw Boom.notFound('User not found');
      }

      return h.response(ResponseFormatter.success(updatedUser));
    } catch (error: IAny) {
      if (Boom.isBoom(error)) {
        throw error;
      }
      throw Boom.badImplementation('Failed to update user');
    }
  };

  public deleteUser = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    try {
      const { id } = request.params;
      const result = await this.userService.deleteUser(id);

      if (!result) {
        throw Boom.notFound('User not found');
      }

      return h.response(ResponseFormatter.success({ message: 'User deleted successfully' }));
    } catch (error: IAny) {
      if (Boom.isBoom(error)) {
        throw error;
      }
      throw Boom.badImplementation('Failed to delete user');
    }
  };
}
