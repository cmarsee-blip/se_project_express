const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const {
  login,
  createUser,
  getCurrentUser,
  updateUser,
} = require("./controllers/users");
const auth = require("./middlewares/auth");
const { createItem } = require("./controllers/clothingItems");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133",
  };
  next();
});
app.post("/signin", login);
app.post("/signup", createUser);
app.use("/", mainRouter);
app.use(cors());
app.get("/users/me", auth, getCurrentUser);
app.post("/items", auth, createItem);
app.patch("/me", updateUser);

// const routes = require("./routes");

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
