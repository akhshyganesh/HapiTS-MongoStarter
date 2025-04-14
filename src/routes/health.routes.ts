import { ServerRoute, Request, ResponseToolkit } from '@hapi/hapi';
import ResponseFormatter from '../utils/response/formatter';

export const healthRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/health',
    options: {
      auth: false,
      description: 'Health check endpoint',
      tags: ['api', 'health'],
      handler: (_request: Request, h: ResponseToolkit): ReturnType<typeof h.response> => {
        return h.response(
          ResponseFormatter.success({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
          }),
        );
      },
    },
  },
];
