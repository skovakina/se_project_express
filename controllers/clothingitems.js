const ClothingItem = require("../models/clothingitem");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
} = require("../utils/errors");

module.exports.getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(next);
};

module.exports.createItem = (req, res, next) => {
  const { name, weather, imageUrl, owner = req.user._id } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });
};

module.exports.deleteItem = (req, res, next) => {
  const id = req.params.itemId;

  ClothingItem.findById(id)
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }

      if (item.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError(
          "You do not have permission to delete this item",
        );
      }

      return ClothingItem.deleteOne({ _id: id })
        .then(() => res.send({ message: "Item deleted" }))
        .catch((err) => {
          if (err.name === "CastError") {
            next(new BadRequestError("Invalid data"));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID"));
      } else {
        next(err);
      }
    });
};

module.exports.likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }

      return res.send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID"));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      return res.send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID"));
      } else {
        next(err);
      }
    });
};
