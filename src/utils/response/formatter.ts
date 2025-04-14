export interface ApiResponse<T> {
  isOk: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string | number;
    details?: unknown;
  };
}

export class ResponseFormatter {
  static success<T>(data?: T): ApiResponse<T> {
    return {
      isOk: true,
      data,
    };
  }

  static error(message: string, code?: string | number, details?: unknown): ApiResponse<never> {
    return {
      isOk: false,
      error: {
        message,
        code,
        details,
      },
    };
  }
}

export default ResponseFormatter;
