const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const auth = require("../middlewares/auth");
const {
  validateCardBody,
  validateItemId,
} = require("../middlewares/validation");

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
router.post("/", validateCardBody, createItem);

// DELETE (validate params)
router.delete("/:itemId", validateItemId, deleteItem);

// LIKE (validate params)
router.put("/:itemId/likes", validateItemId, likeItem);

// DISLIKE (validate params)
router.delete("/:itemId/likes", validateItemId, dislikeItem);

module.exports = router;
