import { Request, ResponseToolkit } from '@hapi/hapi';
import logger from '@/utils/logger';

export const ipLogger = async (request: Request, h: ResponseToolkit): Promise<symbol> => {
  const { remoteAddress } = request.info;
  const { method, path } = request;

  logger.info(`Request received: ${method.toUpperCase()} ${path}`, {
    ip: remoteAddress,
    userAgent: request.headers['user-agent'],
    referrer: request.headers.referer || request.headers.referrer,
    query: request.query,
  });

  return h.continue;
};
