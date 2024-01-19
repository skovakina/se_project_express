const router = require("express").Router();
const {
  createUser,
  login,
  getCurrentUser,
  updateUser,
} = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateSignup, validateSignin } = require("../middlewares/validation");

router.get("/users/me", auth, getCurrentUser);
router.patch("/users/me", auth, updateUser);
router.post("/signin", validateSignin, login);
router.post("/signup", validateSignup, createUser);

module.exports = router;
