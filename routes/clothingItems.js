const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const auth = require("../middlewares/auth");
const { validateCardBody } = require("../middlewares/validation");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// validation for :itemId param
const validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required().messages({
      "string.length": 'The "itemId" must be a 24-character hex string',
      "string.hex": 'The "itemId" must be a hex string',
      "any.required": 'The "itemId" parameter is required',
    }),
  }),
});

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
