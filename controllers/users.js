const bcrypt = require("bcrypt");
const User = require("../models/user");
const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
  CONFLICT,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const jwt = require("jsonwebtoken");

// Get /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  User.create({ name, avatar, email, password: hashedPassword })
    .then((user) =>
      res.status(201).send({
        name: user.name,
        email: user.email,
        _id: user._id,
        avatar: user.avatar,
      })
    )
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      if (err.code === 11000) {
        return res.status(CONFLICT).send({ message: "User already exists" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password == null) {
    return res.status(BAD_REQUEST).send({ message: "Invalid data " });
  }
  // check for nullish values in JavaScript

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      return User.findUserByCredentials(email, password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error("Incorrect email or password"));
          }
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
            expiresIn: "7d",
          });
          return res.send({ token });
        })
        .catch((err) => {
          return res
            .status(BAD_REQUEST)
            .send({ message: "Incorrect email or password" });
        });
    })
    .catch((err) => {
      return res.status(UNAUTHORIZED).send({ message: err.message });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Data not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id; // Getting ID from auth middleware!

  User.findById(userId)
    .then((user) => res.json(user))
    .catch((err) =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error has occurred on the server" })
    );
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(name, avatar)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Data not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  login,
  getCurrentUser,
  updateUser,
};
