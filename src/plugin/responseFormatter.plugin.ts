import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';

interface SuccessResponse<T> {
  isOk: true;
  data: T;
}

interface ErrorResponse {
  isOk: false;
  error: any;
  message: string;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

const formatResponse = <T>(data: T): ApiResponse<T> => ({
  isOk: true,
  data,
});

const formatError = (error: any, message: string): ErrorResponse => ({
  isOk: false,
  error,
  message,
});

const responseFormatter: Hapi.Plugin<undefined> = {
  name: 'responseFormatterPlugin',
  register: async function (server: Hapi.Server) {
    server.ext('onPreResponse', (request, h) => {
      const response = request.response;

      if (Boom.isBoom(response)) {
        // Handle Boom errors
        const boomError = response as Boom.Boom;
        const { statusCode, payload } = boomError.output;
        return h
          .response(formatError(payload, boomError.message))
          .code(statusCode);
      } else {
        // Format success responses
        const regularResponse = response as Hapi.ResponseObject;
        return h
          .response(formatResponse(regularResponse.source))
          .code(regularResponse.statusCode);
      }
    });
  },
};

export default responseFormatter;
