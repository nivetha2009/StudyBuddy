/**
 * Error type that carries a student-friendly message.
 * Anything thrown that is not an ApiError is reported as a generic message,
 * so internal details never reach the browser.
 */
export class ApiError extends Error {
  constructor(status, message, code = 'REQUEST_FAILED') {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.isApiError = true;
  }

  static badRequest(message, code = 'INVALID_INPUT') {
    return new ApiError(400, message, code);
  }

  static notFound(message = 'We could not find that study material.', code = 'NOT_FOUND') {
    return new ApiError(404, message, code);
  }

  static tooLarge(message, code = 'FILE_TOO_LARGE') {
    return new ApiError(413, message, code);
  }

  static unavailable(message = 'The AI service is currently unavailable. Please try again in a moment.', code = 'AI_UNAVAILABLE') {
    return new ApiError(503, message, code);
  }
}
