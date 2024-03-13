const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const router = express.Router();
router.use(express.json());

router.get("/all", async (req, res) => {
  //get all the users
  const users = await User.find({});
  res.json({ users: users });
});
// Register a new user
router.post("/register", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password, bio, profilePictureUrl } = req.body;

    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).send({ msg: "User already exists" });
    }

    user = new User({
      username,
      password,
      bio,
      profilePictureUrl,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update user
router.patch("/me", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).send();
    }

    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete user
router.delete("/me", auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.send({ msg: "User deleted" });
  } catch (error) {
    res.status(500).send();
  }
});

// Follow another user
router.post("/:id/follow", auth, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return res.status(404).send("User not found");
    }

    if (!currentUser.following.includes(req.params.id)) {
      currentUser.following.push(req.params.id);
      await currentUser.save();
    }

    res.status(200).send(currentUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Unfollow another user
router.post("/:id/unfollow", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    const index = currentUser.following.indexOf(req.params.id);
    if (index !== -1) {
      currentUser.following.splice(index, 1);
      await currentUser.save();
    }

    res.status(200).send(currentUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
