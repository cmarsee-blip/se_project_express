const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// CRUD

// CREATE
router.post("/", createItem);

// READ
router.get("/", getItems);

// UPDATE
// router.get("/:itemId", updateItem);

// DELETE
router.delete("/:itemId", deleteItem);

// LIKE
router.get("/:itemId", likeItem);

// DISLIKE
router.delete("/:itemId", dislikeItem);

module.exports = router;
