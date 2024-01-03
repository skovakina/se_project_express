const jwt = require("jsonwebtoken");
const { UNAUTHORIZED } = require("../utils/errors");

const { JWT_SECRET, NODE_ENV } = process.env;

const handleAuthError = (res) =>
  res.status(UNAUTHORIZED).send({ message: "Authorization Error" });

const extractBearerToken = (header) => header.replace("Bearer ", "");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
    );
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;
  return next();
};
