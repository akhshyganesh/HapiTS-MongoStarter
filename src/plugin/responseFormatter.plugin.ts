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

export const responseFormatter: Hapi.Plugin<undefined> = {
  name: 'responseFormatterPlugin',
  register: async function (server: Hapi.Server) {
    server.ext('onPreResponse', (request, h) => {
      const response = request.response as Hapi.ResponseObject;

      let headers: any = {};
      if (response && response.headers) {
        headers = response.headers;
      }

      if (Boom.isBoom(response)) {
        // Handle Boom errors
        const boomError = response as Boom.Boom;
        const { statusCode, payload } = boomError.output;
        let responseToolkit: any = h
          .response(formatError(payload, boomError.message))
          .code(statusCode);

        Object.entries(headers).forEach(([key, value]) => {
          responseToolkit.header(key, value);
        });

        return responseToolkit;
      } else {
        // Format success responses
        const regularResponse = response as Hapi.ResponseObject;
        let responseToolkit: any = h
          .response(formatResponse(regularResponse.source))
          .code(regularResponse.statusCode);

        Object.entries(headers).forEach(([key, value]) => {
          responseToolkit.header(key, value);
        });

        return responseToolkit;
      }
    });
  },
};
