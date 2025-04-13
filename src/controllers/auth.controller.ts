import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import Boom from '@hapi/boom';
import { loginSchema } from '@/schemas/user.schema';
import { AuthService } from '@/services/auth.service';
import ResponseFormatter from '@/utils/response/formatter';

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public login = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    try {
      const credentials = await loginSchema.validateAsync(request.payload);
      const result = await this.authService.login(credentials.email, credentials.password);

      return h.response(ResponseFormatter.success(result));
    } catch (error: IAny) {
      if (error.name === 'ValidationError') {
        throw Boom.badRequest(error.message);
      }
      if (error.message === 'Invalid credentials') {
        throw Boom.unauthorized('Invalid email or password');
      }
      throw Boom.badImplementation('An error occurred during login');
    }
  };
}
