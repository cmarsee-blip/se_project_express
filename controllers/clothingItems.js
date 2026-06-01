const ClothingItem = require("../models/clothingItem");
// const {
//   BAD_REQUEST,
//   NOT_FOUND,
//   INTERNAL_SERVER_ERROR,
//   FORBIDDEN,
// } = require("../utils/errors");
// use centralized error classes
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../middlewares/error-handler");

const createItem = (req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(req);
  // eslint-disable-next-line no-console
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return next(err);
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const currentUserId = req.user._id;

  // eslint-disable-next-line no-console
  console.log(itemId);
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== currentUserId.toString()) {
        // delegate forbidden error to centralized handler
        return next(new ForbiddenError("Access denied"));
      }
      return ClothingItem.findByIdAndDelete(itemId).then((deletedItem) => {
        // Only one response is sent, and it's the deleted item
        res.send(deletedItem);
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };
