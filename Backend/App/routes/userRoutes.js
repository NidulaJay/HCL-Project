const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post("/create", async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      console.log("already exist");
      return res.status(409).json({ error: "This username already exists." });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username }).select("-role");;
    if (!existingUser) {
      return res.status(401).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      existingUser.password
    );
    if (!isPasswordValid) {
      console.log("password mismatch");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const payload = {
      id: existingUser._id,
      name: existingUser.name,
      username: existingUser.username,
    };

    res.status(200).json({ message: "Login successful", user: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all users
router.get("/all", async (req, res) => {
  try {
    const users = await User.find().select("-password -role");
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

router.post("/getRole", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).select('role');
    console.log(user)
    res.status(200).json({data: user});
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

module.exports = router;
