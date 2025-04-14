import winston from 'winston';
import path from 'path';
import * as util from 'util';

// Create custom format for better debug logging
const customFormat = winston.format.printf(({ level, message, timestamp, stack, ...metadata }) => {
  // Convert objects to readable format
  const formattedMessage =
    typeof message === 'object' ? util.inspect(message, { colors: true, depth: 5 }) : message;

  // Include stack trace if available
  const stackInfo = stack ? `\n${stack}` : '';

  // Include metadata if exists
  const meta = Object.keys(metadata).length
    ? `\n${util.inspect(metadata, { colors: true, depth: 5 })}`
    : '';

  return `${timestamp} [${level}]: ${formattedMessage}${stackInfo}${meta}`;
});

// Function to get caller information (file, line, method)
const getCallerInfo = (): IAny => {
  const stackLines = new Error().stack?.split('\n').slice(3) || [];
  const callerLine = stackLines[0] || '';
  const match =
    callerLine.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/) ||
    callerLine.match(/at\s+()(.*):(\d+):(\d+)/);

  if (!match) return { function: 'unknown', file: 'unknown', line: 'unknown' };

  const [, fnName, filePath, line] = match;
  const file = filePath ? path.basename(filePath) : 'unknown';

  return {
    function: fnName || 'anonymous',
    file,
    line,
  };
};

// Create the base logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.metadata(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), customFormat),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Extend the logger with convenience methods and additional context
const extendedLogger = {
  ...logger,

  // Convenience methods with caller information
  debug: (message: IAny, meta: object = {}): void => {
    const callerInfo = getCallerInfo();
    logger.debug(message, { ...meta, caller: callerInfo });
  },

  info: (message: IAny, meta: object = {}): void => {
    const callerInfo = getCallerInfo();
    logger.info(message, { ...meta, caller: callerInfo });
  },

  warn: (message: IAny, meta: object = {}): void => {
    const callerInfo = getCallerInfo();
    logger.warn(message, { ...meta, caller: callerInfo });
  },

  error: (message: IAny, meta: object = {}): void => {
    const callerInfo = getCallerInfo();
    logger.error(message, { ...meta, caller: callerInfo });
  },

  // Create a child logger with request ID for tracking requests
  createRequestLogger: (requestId: string): IAny => {
    return {
      debug: (message: IAny, meta: object = {}): void => {
        const callerInfo = getCallerInfo();
        logger.debug(message, { ...meta, requestId, caller: callerInfo });
      },
      info: (message: IAny, meta: object = {}): void => {
        const callerInfo = getCallerInfo();
        logger.info(message, { ...meta, requestId, caller: callerInfo });
      },
      warn: (message: IAny, meta: object = {}): void => {
        const callerInfo = getCallerInfo();
        logger.warn(message, { ...meta, requestId, caller: callerInfo });
      },
      error: (message: IAny, meta: object = {}): void => {
        const callerInfo = getCallerInfo();
        logger.error(message, { ...meta, requestId, caller: callerInfo });
      },
    };
  },
};

export default extendedLogger;
