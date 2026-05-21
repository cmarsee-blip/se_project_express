const express = require("express");
const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUser);
router.post("/signin", (req, res) => {
  const token = jwt.sign({ _id: user._id }, JWT_SECRET);

  res.cookie("jwt", token, {
    maxAge: 3600000,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.send({ message: "Login successful" });
});

module.exports = router;
