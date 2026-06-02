const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { createUser, login } = require("../controllers/users");
const clothingItem = require("./clothingItems");
const {
  validateUserBody,
  validateSignin,
} = require("../middlewares/validation");
const { NotFoundError } = require("../middlewares/error-handler");

const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", clothingItem);
router.get(
  "/crash-test",
  // single-expression arrow to satisfy `arrow-body-style` lint rule
  () =>
    setTimeout(() => {
      throw new Error("Server will crash now");
    }, 0)
);

// apply validation to auth routes
router.post("/signin", validateSignin, login);
router.post("/signup", validateUserBody, createUser);

router.use((req, res, next) =>
  // delegate unknown-route handling to centralized error handler
  next(new NotFoundError("Requested resource not found"))
);

module.exports = router;
