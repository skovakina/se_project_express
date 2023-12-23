const User = require("../models/user");

const {
  INVALID_DATA,
  SERVER_ERROR,
  ValidationError,
} = require("../utils/errors");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      console.log(err.name);

      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error("User ID not found");
      error.statusCode = 404;
      return res.status(error.statusCode).send({ message: "User not found" });
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(INVALID_DATA)
          .send({ message: "Invalid User ID format" });
      } else {
        console.log(err);
        return res
          .status(SERVER_ERROR)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(INVALID_DATA).send({ message: "Validation error" });
      } else {
        return res
          .status(SERVER_ERROR)
          .send({ message: "An error has occurred on the server." });
      }
    });
};
