const ClothingItem = require("../models/clothingitem");
const { INVALID_DATA, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

module.exports.getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send({ data: items }))
    .catch(() =>
      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." }),
    );
};

module.exports.createItem = (req, res) => {
  const { name, weather, imageUrl, owner = req.user._id } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(INVALID_DATA).send({ message: "Invalid data" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.deleteItem = (req, res) => {
  const id = req.params.itemId;

  ClothingItem.findOneAndDelete({ _id: id })
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res.send({ message: "Item delited" });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(INVALID_DATA).send({ message: "Invalid ID" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res.send({ message: "item has been liked" });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(INVALID_DATA).send({ message: "Invalid ID" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res.send({ message: "item has been unliked" });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(INVALID_DATA).send({ message: "Invalid ID" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};
