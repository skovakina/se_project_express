const User = require("../models/user");

const { INVALID_DATA, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() =>
      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." }),
    );
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(INVALID_DATA)
          .send({ message: "Invalid User ID format" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(INVALID_DATA).send({ message: "Validation error" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};
