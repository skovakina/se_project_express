const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingitems");
const auth = require("../middlewares/auth");

const { validateCardBody, validateId } = require("../middlewares/validation");

router.get("/items", getItems);
router.post("/items", validateCardBody, auth, createItem);
router.delete("/items/:_id", validateId, auth, deleteItem);

router.put("/items/:_id/likes", validateId, auth, likeItem);
router.delete("/items/:_id/likes", validateId, auth, dislikeItem);

module.exports = router;
