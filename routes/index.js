const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { createUser, login } = require("../controllers/users");
const clothingItem = require("./clothingItems");
const { validateUserBody } = require("../middlewares/validation");
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

// validate signin (email + password)
const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// apply validation to auth routes
router.post("/signin", validateSignin, login);
router.post("/signup", validateUserBody, createUser);

router.use((req, res, next) => 
  // delegate unknown-route handling to centralized error handler
   next(new NotFoundError("Requested resource not found"))
);

module.exports = router;
