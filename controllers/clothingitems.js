const ClothinItem = require("../models/clothingitem");

// GET /items — returns all clothing items
// POST /items — creates a new item
// DELETE /items/:itemId — deletes an item by _id

module.exports.getItems = (req, res) => {
  ClothinItem.find({})
    .then((items) => res.send({ data: items }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createItem = (req, res) => {
  const { name, weather, imageUrl, userId } = req.body;
  ClothinItem.create({ name, weather, imageUrl, userId: userId })
    .then((item) => res.send({ data: item }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothinItem.deleteOne({ itemId })
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      res.send({ message: "Item delited" });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};
