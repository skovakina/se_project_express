const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
} = require("../utils/errors");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("No user with matching ID found");
      }

      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid User ID"));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  if (!name || !avatar || !email || !password) {
    throw new BadRequestError("All fields are required");
  }
  return User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        throw new ConflictError("User already exists");
      }

      return bcrypt
        .hash(password, 10)
        .then((hash) => User.create({ name, avatar, email, password: hash }))
        .then((userNew) =>
          res.send({ name: userNew.name, avatar: userNew.avatar }),
        )
        .catch((err) => {
          if (err.name === "ValidationError") {
            next(new BadRequestError("Validation error"));
          }
        });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("All fields are required");
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError("Incorrect email or password");
      }

      return res.send({
        user: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          _id: user.id,
        },
        token: jwt.sign(
          { _id: user._id },
          NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
          {
            expiresIn: "7d",
          },
        ),
      });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError("Incorrect email or password"));
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const _id = req.user._id;

  User.findByIdAndUpdate(
    _id,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("No user with matching ID found");
      }
      return res.send({ data: user });
    })
    .catch(next);
};
