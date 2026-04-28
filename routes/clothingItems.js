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
router.put("/:itemId/likes", likeItem);

// DISLIKE
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
