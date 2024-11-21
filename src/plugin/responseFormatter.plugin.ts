import Hapi from '@hapi/hapi';
import { ResponseObject } from '@hapi/hapi';
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
      const response = request.response;

      if (Boom.isBoom(response)) {
        // Standardize Boom errors
        const { statusCode, payload } = response.output;
        return h
          .response(formatError(payload, response.message))
          .code(statusCode)
          .takeover();
      }

      if (
        response instanceof Object &&
        (response as ResponseObject).source !== undefined
      ) {
        const responseObject = response as ResponseObject;
        const source = responseObject.source;

        if (source && typeof source === 'object' && 'isOk' in source) {
          return h.continue; // Already formatted, continue
        }

        return h
          .response(formatResponse(source))
          .code(responseObject.statusCode)
          .takeover();
      }

      return h.continue;
    });
  },
};
