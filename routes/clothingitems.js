const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingitems");
const auth = require("../middlewares/auth");

const {
  validateCardBody,
  // validateId,
} = require("../middlewares/validation");

router.get("/items", getItems);
router.post("/items", validateCardBody, auth, createItem);
router.delete("/items/:itemId", auth, deleteItem);

router.put("/items/:itemId/likes", auth, likeItem);
router.delete("/items/:itemId/likes", auth, dislikeItem);

module.exports = router;
