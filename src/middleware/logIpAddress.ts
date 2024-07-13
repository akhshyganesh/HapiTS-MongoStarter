import { Request, ResponseToolkit } from '@hapi/hapi';

const DEVELOP = 'develop';

const logIpAddress = (request: Request, h: ResponseToolkit) => {
  if (DEVELOP === process.env.ENV) {
    return h.continue;
  }

  const ip = request.info.remoteAddress;
  console.log(`IP Address: ${ip}`);
  // TODO: Add logics to save ip address
  return h.continue;
};

export default logIpAddress;
