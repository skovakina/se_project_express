module.exports = {
  INVALID_DATA: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  OK: 200,
  CREATED: 201,
  CONFLICT: 409,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
};

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
  }
}

module.exports.ValidationError;
