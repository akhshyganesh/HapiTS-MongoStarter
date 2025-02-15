import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { Request, ResponseToolkit } from '@hapi/hapi';

interface StandardResponse {
  isOk: boolean;
  data?: any;
  error?: any;
  message: string;
}

export const responseFormatter: Hapi.Plugin<undefined> = {
  name: 'responseFormatterPlugin',
  register: async function (server: Hapi.Server) {
    server.ext('onPreResponse', (request: Request, h: ResponseToolkit) => {
      const response = request.response;

      if (Boom.isBoom(response)) {
        const standardResponse: StandardResponse = {
          isOk: false,
          error: {
            statusCode: response.output.statusCode,
            error: response.output.payload.error,
          },
          message: response.message,
        };
        return h.response(standardResponse).code(response.output.statusCode);
      }

      // Format successful responses
      const standardResponse: StandardResponse = {
        isOk: true,
        data: response.source,
        message: 'Success',
      };

      return h.response(standardResponse);
    });
  },
};
