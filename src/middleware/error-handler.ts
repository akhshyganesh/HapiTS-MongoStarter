import { Request, ResponseToolkit } from '@hapi/hapi';
import Boom from '@hapi/boom';
import logger from '@/utils/logger';
import ResponseFormatter from '@/utils/response/formatter';

export const errorHandler = (request: Request, h: ResponseToolkit, err: Error): never => {
  if (err.name === 'ValidationError') {
    throw Boom.badRequest(err.message);
  }

  throw err;
};

export const boomErrorHandler = (
  request: Request,
  h: ResponseToolkit,
  error: Boom.Boom,
): ReturnType<typeof h.response> => {
  const { output } = error;
  const errorResponse = ResponseFormatter.error(
    output.payload.message,
    output.statusCode,
    error.data,
  );

  logger.error(`Error: ${output.payload.message}`, {
    statusCode: output.statusCode,
    data: error.data,
    path: request.path,
    method: request.method,
    ip: request.info.remoteAddress,
  });

  return h.response(errorResponse).code(output.statusCode);
};
