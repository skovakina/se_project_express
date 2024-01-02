const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const { NODE_ENV, JWT_SECRET } = process.env;

const {
  INVALID_DATA,
  NOT_FOUND,
  SERVER_ERROR,
  CONFLICT,
  UNAUTHORIZED,
} = require("../utils/errors");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() =>
      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." }),
    );
};

module.exports.getCurrentUser = (req, res) => {
  const userId = req.user._id;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(INVALID_DATA).send({ message: "Invalid User ID" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (!name || !avatar || !email || !password) {
    return res
      .status(INVALID_DATA)
      .send({ message: "All fields are required" });
  }
  return User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return res.status(CONFLICT).send({ message: "User already exists" });
      }

      return bcrypt
        .hash(req.body.password, 10)
        .then((hash) =>
          User.create({
            name: req.body.name,
            avatar: req.body.avatar,
            email: req.body.email,
            password: hash,
          })
            .then((userNew) =>
              res.send({ name: userNew.name, avatar: userNew.avatar }),
            )
            .catch((err) => {
              if (err.name === "ValidationError") {
                return res
                  .status(INVALID_DATA)
                  .send({ message: "Validation error" });
              }
              return res
                .status(SERVER_ERROR)
                .send({ message: "An error has occurred on the server." });
            }),
        )
        .catch(() =>
          res
            .status(SERVER_ERROR)
            .send({ message: "An error has occurred on the server." }),
        );
    })
    .catch(() =>
      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." }),
    );
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(INVALID_DATA)
      .send({ message: "All fields are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      return res.send({
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
        return res
          .status(UNAUTHORIZED)
          .send({ message: "Incorrect email or password" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(INVALID_DATA).send({ message: "Validation error" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};
