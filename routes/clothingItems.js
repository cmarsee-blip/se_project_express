const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// CRUD
router.get("/", getItems);
router.use(auth);

// CREATE
router.post("/", createItem);

// READ

// UPDATE
// router.get("/:itemId", updateItem);

// DELETE
router.delete("/:itemId", deleteItem);

// LIKE
router.put("/:itemId/likes", likeItem);

// DISLIKE
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
