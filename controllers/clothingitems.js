const ClothingItem = require("../models/clothingitem");

module.exports.getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send({ data: items }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createItem = (req, res) => {
  const { name, weather, imageUrl, userId } = req.body;
  ClothingItem.create({ name, weather, imageUrl, userId: userId })
    .then((item) => res.send({ data: item }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.deleteItem = (req, res) => {
  const { _id: itemId } = req.params;
  ClothingItem.deleteOne({ itemId })
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      res.send({ message: "Item delited" });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};
