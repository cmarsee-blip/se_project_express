const router = require("express").Router();
const { createUser, login } = require("../controllers/users");
const clothingItem = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");

const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", clothingItem);
router.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
router.post("/signin", login);
router.post("/signup", createUser);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
